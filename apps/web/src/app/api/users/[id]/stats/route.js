import { neon } from '@neondatabase/serverless';

export async function GET(request, { params }) {
  try {
    const userId = params.id;

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({
        totalQuestionsAnswered: 150,
        correctAnswers: 120,
        accuracy: 80,
        streak: 5,
        totalStudyTime: 1200,
        categoryStats: {
          '一般小児科': { answered: 30, correct: 24 },
          '新生児・周産期': { answered: 25, correct: 20 },
          '呼吸器': { answered: 20, correct: 16 },
          '循環器': { answered: 15, correct: 12 },
          '消化器': { answered: 18, correct: 14 },
          '神経': { answered: 12, correct: 10 },
          '内分泌': { answered: 10, correct: 8 },
          '血液・腫瘍': { answered: 8, correct: 6 },
          '免疫・アレルギー': { answered: 6, correct: 5 },
          '感染症': { answered: 22, correct: 18 },
          '救急・蘇生': { answered: 16, correct: 13 },
          '発達・行動': { answered: 4, correct: 3 }
        }
      });
    }

    // 実際のデータベースから統計を取得
    const sql = neon(process.env.DATABASE_URL);
    const stats = await sql`
      SELECT 
        COUNT(*) as total_answered,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
        AVG(CASE WHEN is_correct THEN 1.0 ELSE 0.0 END) * 100 as accuracy,
        MAX(streak) as current_streak,
        SUM(study_time_minutes) as total_study_time
      FROM user_progress 
      WHERE user_id = ${userId}
    `;

    const categoryStats = await sql`
      SELECT 
        q.category,
        COUNT(*) as answered,
        SUM(CASE WHEN up.is_correct THEN 1 ELSE 0 END) as correct
      FROM user_progress up
      JOIN questions q ON up.question_id = q.id
      WHERE up.user_id = ${userId}
      GROUP BY q.category
    `;

    const categoryStatsObj = {};
    categoryStats.forEach(row => {
      categoryStatsObj[row.category] = {
        answered: parseInt(row.answered),
        correct: parseInt(row.correct)
      };
    });

    return Response.json({
      totalQuestionsAnswered: parseInt(stats[0].total_answered) || 0,
      correctAnswers: parseInt(stats[0].correct_answers) || 0,
      accuracy: parseFloat(stats[0].accuracy) || 0,
      streak: parseInt(stats[0].current_streak) || 0,
      totalStudyTime: parseInt(stats[0].total_study_time) || 0,
      categoryStats: categoryStatsObj
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return Response.json(
      { error: '統計データの取得に失敗しました' },
      { status: 500 }
    );
  }
}
