import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({
        totalUsers: 15,
        activeUsers: 12,
        totalQuestions: 5,
        totalSessions: 45,
        averageAccuracy: 78.5,
        categoryStats: {
          '一般小児科': { questions: 5, sessions: 20, accuracy: 80 },
          '新生児・周産期': { questions: 0, sessions: 15, accuracy: 75 },
          '呼吸器': { questions: 0, sessions: 10, accuracy: 85 }
        },
        userGrowth: [
          { date: '2024-01-01', users: 5 },
          { date: '2024-01-02', users: 7 },
          { date: '2024-01-03', users: 10 },
          { date: '2024-01-04', users: 12 },
          { date: '2024-01-05', users: 15 }
        ],
        recentActivity: [
          {
            id: 'activity_1',
            type: 'user_registration',
            description: '新しいユーザーが登録されました',
            timestamp: new Date().toISOString()
          },
          {
            id: 'activity_2',
            type: 'session_completed',
            description: '学習セッションが完了されました',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          }
        ]
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 総ユーザー数
    const totalUsersResult = await sql`
      SELECT COUNT(*) as total FROM users
    `;
    const totalUsers = parseInt(totalUsersResult[0].total);

    // アクティブユーザー数（過去30日間）
    const activeUsersResult = await sql`
      SELECT COUNT(DISTINCT user_id) as active 
      FROM study_history 
      WHERE answered_at >= CURRENT_DATE - INTERVAL '30 days'
    `;
    const activeUsers = parseInt(activeUsersResult[0].active);

    // 総問題数
    const totalQuestionsResult = await sql`
      SELECT COUNT(*) as total FROM questions WHERE status = 'published'
    `;
    const totalQuestions = parseInt(totalQuestionsResult[0].total);

    // 総セッション数
    const totalSessionsResult = await sql`
      SELECT COUNT(*) as total FROM study_sessions
    `;
    const totalSessions = parseInt(totalSessionsResult[0].total);

    // 平均正答率
    const averageAccuracyResult = await sql`
      SELECT AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) * 100 as accuracy
      FROM study_history
    `;
    const averageAccuracy = parseFloat(averageAccuracyResult[0].accuracy || 0);

    // カテゴリ別統計
    const categoryStatsResult = await sql`
      SELECT 
        q.category,
        COUNT(DISTINCT q.id) as questions,
        COUNT(DISTINCT ss.id) as sessions,
        AVG(CASE WHEN sh.is_correct THEN 1.0 ELSE 0.0 END) * 100 as accuracy
      FROM questions q
      LEFT JOIN study_history sh ON q.id = sh.question_id
      LEFT JOIN study_sessions ss ON q.category = ss.category
      WHERE q.status = 'published'
      GROUP BY q.category
    `;

    const categoryStats = {};
    categoryStatsResult.forEach(row => {
      categoryStats[row.category] = {
        questions: parseInt(row.questions),
        sessions: parseInt(row.sessions),
        accuracy: parseFloat(row.accuracy || 0)
      };
    });

    // ユーザー成長（過去30日間）
    const userGrowthResult = await sql`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as users
      FROM users 
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `;

    const userGrowth = userGrowthResult.map(row => ({
      date: row.date.toISOString().split('T')[0],
      users: parseInt(row.users)
    }));

    // 最近の活動
    const recentActivityResult = await sql`
      SELECT 
        'user_registration' as type,
        '新しいユーザーが登録されました' as description,
        created_at as timestamp
      FROM users
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      
      UNION ALL
      
      SELECT 
        'session_completed' as type,
        '学習セッションが完了されました' as description,
        completed_at as timestamp
      FROM study_sessions
      WHERE completed_at >= CURRENT_DATE - INTERVAL '7 days'
      
      ORDER BY timestamp DESC
      LIMIT 10
    `;

    const recentActivity = recentActivityResult.map(activity => ({
      id: `activity_${Date.now()}_${Math.random()}`,
      type: activity.type,
      description: activity.description,
      timestamp: activity.timestamp.toISOString()
    }));

    return Response.json({
      totalUsers,
      activeUsers,
      totalQuestions,
      totalSessions,
      averageAccuracy,
      categoryStats,
      userGrowth,
      recentActivity
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return Response.json(
      { error: '分析データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
