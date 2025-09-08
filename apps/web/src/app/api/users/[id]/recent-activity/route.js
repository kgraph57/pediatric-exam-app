import { neon } from '@neondatabase/serverless';

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      const demoActivity = [
        {
          id: 'activity_1',
          type: 'practice',
          category: '一般小児科',
          difficulty: '中級',
          questions: 10,
          correct: 8,
          accuracy: 80,
          timeSpent: 450,
          date: new Date().toISOString()
        },
        {
          id: 'activity_2',
          type: 'practice',
          category: '新生児・周産期',
          difficulty: '中級',
          questions: 5,
          correct: 4,
          accuracy: 80,
          timeSpent: 300,
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 'activity_3',
          type: 'practice',
          category: '呼吸器',
          difficulty: '初級',
          questions: 8,
          correct: 6,
          accuracy: 75,
          timeSpent: 360,
          date: new Date(Date.now() - 172800000).toISOString()
        }
      ];

      return Response.json({ activity: demoActivity });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 最近の学習セッションを取得
    const sessions = await sql`
      SELECT 
        ss.id,
        ss.session_type as type,
        ss.category,
        ss.difficulty,
        ss.total_questions as questions,
        ss.correct_answers as correct,
        ss.time_spent,
        ss.started_at as date
      FROM study_sessions ss
      WHERE ss.user_id = ${userId}
      ORDER BY ss.started_at DESC
      LIMIT ${limit}
    `;

    const activity = sessions.map(session => ({
      id: session.id,
      type: session.type,
      category: session.category,
      difficulty: session.difficulty,
      questions: parseInt(session.questions),
      correct: parseInt(session.correct),
      accuracy: session.questions > 0 ? Math.round((session.correct / session.questions) * 100) : 0,
      timeSpent: parseInt(session.time_spent || 0),
      date: session.date.toISOString()
    }));

    return Response.json({ activity });

  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return Response.json(
      { error: '最近の活動の取得に失敗しました' },
      { status: 500 }
    );
  }
}
