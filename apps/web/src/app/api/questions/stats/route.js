import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({
        totalQuestions: 5,
        categories: {
          '一般小児科': 5
        },
        difficulties: {
          '初級': 1,
          '中級': 3,
          '上級': 1
        },
        recentActivity: [
          {
            date: new Date().toISOString().split('T')[0],
            questionsAnswered: 5,
            correctAnswers: 4
          }
        ]
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 総問題数
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM questions WHERE status = 'published'
    `;
    const totalQuestions = parseInt(totalResult[0].total);

    // カテゴリ別問題数
    const categoryResult = await sql`
      SELECT category, COUNT(*) as count 
      FROM questions 
      WHERE status = 'published'
      GROUP BY category
      ORDER BY count DESC
    `;
    
    const categories = {};
    categoryResult.forEach(row => {
      categories[row.category] = parseInt(row.count);
    });

    // 難易度別問題数
    const difficultyResult = await sql`
      SELECT difficulty, COUNT(*) as count 
      FROM questions 
      WHERE status = 'published'
      GROUP BY difficulty
      ORDER BY count DESC
    `;
    
    const difficulties = {};
    difficultyResult.forEach(row => {
      difficulties[row.difficulty] = parseInt(row.count);
    });

    // 最近の活動（過去7日間）
    const recentActivityResult = await sql`
      SELECT 
        DATE(answered_at) as date,
        COUNT(*) as questions_answered,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers
      FROM study_history 
      WHERE answered_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(answered_at)
      ORDER BY date DESC
    `;

    const recentActivity = recentActivityResult.map(row => ({
      date: row.date.toISOString().split('T')[0],
      questionsAnswered: parseInt(row.questions_answered),
      correctAnswers: parseInt(row.correct_answers)
    }));

    return Response.json({
      totalQuestions,
      categories,
      difficulties,
      recentActivity
    });

  } catch (error) {
    console.error('Error fetching question stats:', error);
    return Response.json(
      { error: '問題統計の取得に失敗しました' },
      { status: 500 }
    );
  }
}
