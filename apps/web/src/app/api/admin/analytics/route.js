import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const days = url.searchParams.get('days') || '7';

    // データベースが利用できない場合のデモデータ
    if (!process.env.DATABASE_URL) {
      return Response.json({
        totalUsers: 1,
        activeUsers: 1,
        totalQuestions: 1469,
        averageAccuracy: 75.5,
        categoryStats: [
          { name: '循環器', count: 107 },
          { name: '呼吸器', count: 161 },
          { name: '消化器', count: 111 },
          { name: '神経', count: 215 },
          { name: '内分泌・代謝', count: 105 },
          { name: '血液・腫瘍', count: 109 },
          { name: '免疫・アレルギー', count: 118 },
          { name: '救急', count: 106 },
          { name: '新生児・周産期', count: 231 },
          { name: '一般', count: 207 }
        ],
        maxCategoryCount: 231,
        dailyActivity: [
          { date: '2024-01-15', users: 1 },
          { date: '2024-01-14', users: 1 },
          { date: '2024-01-13', users: 1 },
          { date: '2024-01-12', users: 1 },
          { date: '2024-01-11', users: 1 },
          { date: '2024-01-10', users: 1 },
          { date: '2024-01-09', users: 1 }
        ],
        maxDailyUsers: 1,
        userDetails: [
          {
            name: 'デモユーザー',
            hospital: '東京小児科病院',
            totalAnswered: 0,
            accuracy: 0,
            lastAccess: new Date().toLocaleDateString('ja-JP')
          }
        ],
        period: `${days}日間`
      });
    }

    // 総ユーザー数
    const totalUsersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(totalUsersResult.rows[0].count);

    // アクティブユーザー数（指定期間内に学習履歴があるユーザー）
    const activeUsersResult = await pool.query(
      `SELECT COUNT(DISTINCT user_id) as count 
       FROM study_history 
       WHERE answered_at >= NOW() - INTERVAL '${days} days'`
    );
    const activeUsers = parseInt(activeUsersResult.rows[0].count);

    // 総問題数（全カテゴリの問題数を合計）
    const totalQuestionsResult = await pool.query(
      `SELECT SUM(count) as total FROM (
        SELECT COUNT(*) as count FROM study_history
        UNION ALL
        SELECT 1469 as count -- 実際の問題数
      ) t`
    );
    const totalQuestions = 1469; // 実際の問題数

    // 平均正解率
    const accuracyResult = await pool.query(
      `SELECT 
        CASE 
          WHEN COUNT(*) = 0 THEN 0 
          ELSE ROUND((COUNT(CASE WHEN is_correct = true THEN 1 END) * 100.0 / COUNT(*)), 1)
        END as accuracy
       FROM study_history`
    );
    const averageAccuracy = parseFloat(accuracyResult.rows[0].accuracy) || 0;

    // カテゴリ別使用状況
    const categoryStatsResult = await pool.query(
      `SELECT 
        category,
        COUNT(*) as count
       FROM study_history 
       WHERE category IS NOT NULL
       GROUP BY category 
       ORDER BY count DESC 
       LIMIT 10`
    );
    
    const categoryStats = categoryStatsResult.rows.map(row => ({
      name: row.category,
      count: parseInt(row.count)
    }));

    const maxCategoryCount = Math.max(...categoryStats.map(c => c.count), 1);

    // 日別アクティビティ
    const dailyActivityResult = await pool.query(
      `SELECT 
        DATE(answered_at) as date,
        COUNT(DISTINCT user_id) as users
       FROM study_history 
       WHERE answered_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(answered_at) 
       ORDER BY date DESC 
       LIMIT ${days}`
    );

    const dailyActivity = dailyActivityResult.rows.map(row => ({
      date: row.date.toISOString().split('T')[0],
      users: parseInt(row.users)
    }));

    const maxDailyUsers = Math.max(...dailyActivity.map(d => d.users), 1);

    // ユーザー詳細（上位10名）
    const userDetailsResult = await pool.query(
      `SELECT 
        u.name,
        u.hospital,
        u.total_answered,
        CASE 
          WHEN u.total_answered = 0 THEN 0
          ELSE ROUND((u.total_correct * 100.0 / u.total_answered), 1)
        END as accuracy,
        COALESCE(MAX(sh.answered_at), u.created_at) as last_access
       FROM users u
       LEFT JOIN study_history sh ON u.id = sh.user_id
       GROUP BY u.id, u.name, u.hospital, u.total_answered, u.total_correct, u.created_at
       ORDER BY u.total_answered DESC
       LIMIT 10`
    );

    const userDetails = userDetailsResult.rows.map(row => ({
      name: row.name,
      hospital: row.hospital,
      totalAnswered: row.total_answered,
      accuracy: parseFloat(row.accuracy) || 0,
      lastAccess: row.last_access ? 
        new Date(row.last_access).toLocaleDateString('ja-JP') : 
        new Date(row.created_at).toLocaleDateString('ja-JP')
    }));

    return Response.json({
      totalUsers,
      activeUsers,
      totalQuestions,
      averageAccuracy,
      categoryStats,
      maxCategoryCount,
      dailyActivity,
      maxDailyUsers,
      userDetails,
      period: `${days}日間`
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return Response.json(
      { message: '分析データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
