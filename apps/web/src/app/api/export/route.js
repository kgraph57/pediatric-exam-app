import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// データをエクスポート
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // users, logs, invitations, analytics
    const format = searchParams.get('format') || 'csv'; // csv, json
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let data = [];
    let filename = '';

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      switch (type) {
        case 'users':
          data = [{
            id: 'demo',
            name: 'デモユーザー',
            email: 'demo@example.com',
            hospital: '東京小児科病院',
            department: '小児科',
            level: 3,
            totalAnswered: 0,
            totalCorrect: 0,
            streak: 0,
            longestStreak: 0,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }];
          filename = 'users';
          break;
        case 'logs':
          data = [];
          filename = 'usage_logs';
          break;
        case 'invitations':
          data = [];
          filename = 'invitations';
          break;
        case 'analytics':
          data = [{
            totalUsers: 1,
            totalQuestions: 1469,
            totalAnswers: 0,
            averageAccuracy: 75
          }];
          filename = 'analytics';
          break;
        default:
          return Response.json(
            { message: '無効なエクスポートタイプです' },
            { status: 400 }
          );
      }
    } else {
      // データベースからデータを取得
      switch (type) {
        case 'users':
          const usersResult = await pool.query(`
            SELECT 
              id, name, email, hospital, department, level,
              total_answered, total_correct, streak, longest_streak,
              experience_years, target_level, specialty, study_goal,
              daily_goal, weekly_goal, study_time, study_frequency,
              created_at, updated_at
            FROM users 
            ORDER BY created_at DESC
          `);
          data = usersResult.rows.map(row => ({
            id: row.id,
            name: row.name,
            email: row.email,
            hospital: row.hospital,
            department: row.department,
            level: row.level,
            totalAnswered: row.total_answered,
            totalCorrect: row.total_correct,
            streak: row.streak,
            longestStreak: row.longest_streak,
            experienceYears: row.experience_years,
            targetLevel: row.target_level,
            specialty: row.specialty,
            studyGoal: row.study_goal,
            dailyGoal: row.daily_goal,
            weeklyGoal: row.weekly_goal,
            studyTime: row.study_time,
            studyFrequency: row.study_frequency,
            createdAt: row.created_at,
            lastLogin: row.updated_at
          }));
          filename = 'users';
          break;

        case 'logs':
          let logsQuery = 'SELECT * FROM usage_logs WHERE 1=1';
          const logsParams = [];
          let logsParamIndex = 1;

          if (startDate) {
            logsQuery += ` AND timestamp >= $${logsParamIndex}`;
            logsParams.push(startDate);
            logsParamIndex++;
          }

          if (endDate) {
            logsQuery += ` AND timestamp <= $${logsParamIndex}`;
            logsParams.push(endDate);
            logsParamIndex++;
          }

          logsQuery += ' ORDER BY timestamp DESC';

          const logsResult = await pool.query(logsQuery, logsParams);
          data = logsResult.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            action: row.action,
            details: row.details,
            timestamp: row.timestamp,
            ipAddress: row.ip_address,
            userAgent: row.user_agent
          }));
          filename = 'usage_logs';
          break;

        case 'invitations':
          const invitationsResult = await pool.query(`
            SELECT 
              id, code, email, name, hospital, department,
              created_at, expires_at, used_at, created_by
            FROM invitations 
            ORDER BY created_at DESC
          `);
          data = invitationsResult.rows.map(row => ({
            id: row.id,
            code: row.code,
            email: row.email,
            name: row.name,
            hospital: row.hospital,
            department: row.department,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
            usedAt: row.used_at,
            createdBy: row.created_by,
            status: row.used_at ? 'used' : (new Date(row.expires_at) < new Date() ? 'expired' : 'active')
          }));
          filename = 'invitations';
          break;

        case 'analytics':
          // 分析データを集計
          const analyticsResult = await pool.query(`
            SELECT 
              COUNT(DISTINCT u.id) as total_users,
              COUNT(DISTINCT l.id) as total_logs,
              COUNT(DISTINCT CASE WHEN l.action = 'practice_answer' THEN l.id END) as total_answers,
              AVG(CASE WHEN l.action = 'practice_answer' THEN (l.details->>'isCorrect')::boolean::int END) * 100 as average_accuracy
            FROM users u
            LEFT JOIN usage_logs l ON u.id = l.user_id
          `);
          
          data = [analyticsResult.rows[0]];
          filename = 'analytics';
          break;

        default:
          return Response.json(
            { message: '無効なエクスポートタイプです' },
            { status: 400 }
          );
      }
    }

    // フォーマットに応じてデータを変換
    if (format === 'csv') {
      if (data.length === 0) {
        return Response.json(
          { message: 'エクスポートするデータがありません' },
          { status: 404 }
        );
      }

      // CSVヘッダーを生成
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
            return `"${String(value).replace(/"/g, '""')}"`;
          }).join(',')
        )
      ].join('\n');

      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    } else if (format === 'json') {
      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}_${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    } else {
      return Response.json(
        { message: '無効なフォーマットです' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Export error:', error);
    return Response.json(
      { message: 'データのエクスポートに失敗しました' },
      { status: 500 }
    );
  }
}
