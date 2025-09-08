import { neon } from '@neondatabase/serverless';

export async function POST(request, { params }) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { 
      sessionType, 
      category, 
      difficulty, 
      totalQuestions, 
      correctAnswers, 
      timeSpent 
    } = body;

    // バリデーション
    if (!sessionType || totalQuestions === undefined || correctAnswers === undefined) {
      return Response.json(
        { error: 'セッションタイプ、問題数、正解数は必須です' },
        { status: 400 }
      );
    }

    // データベース接続がない場合はデモレスポンスを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        message: 'デモモード: 学習セッションが保存されました',
        session: {
          id: `session_${Date.now()}`,
          type: sessionType,
          category: category || '一般小児科',
          difficulty: difficulty || '中級',
          totalQuestions: parseInt(totalQuestions),
          correctAnswers: parseInt(correctAnswers),
          timeSpent: parseInt(timeSpent || 0),
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        }
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 学習セッションを保存
    const result = await sql`
      INSERT INTO study_sessions (
        user_id, session_type, category, difficulty,
        total_questions, correct_answers, time_spent,
        started_at, completed_at
      ) VALUES (
        ${userId}, ${sessionType}, ${category || null}, ${difficulty || null},
        ${parseInt(totalQuestions)}, ${parseInt(correctAnswers)}, ${parseInt(timeSpent || 0)},
        NOW(), NOW()
      ) RETURNING id, session_type, category, difficulty,
                total_questions, correct_answers, time_spent,
                started_at, completed_at
    `;

    const session = result[0];

    // ユーザー統計を更新
    await sql`SELECT update_user_stats(${userId})`;

    return Response.json({ 
      message: '学習セッションが保存されました',
      session: {
        id: session.id,
        type: session.session_type,
        category: session.category,
        difficulty: session.difficulty,
        totalQuestions: parseInt(session.total_questions),
        correctAnswers: parseInt(session.correct_answers),
        timeSpent: parseInt(session.time_spent),
        startedAt: session.started_at.toISOString(),
        completedAt: session.completed_at.toISOString()
      }
    });

  } catch (error) {
    console.error('Error saving session:', error);
    return Response.json(
      { error: '学習セッションの保存に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const sessionType = searchParams.get('type');

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      const demoSessions = [
        {
          id: 'session_1',
          type: 'practice',
          category: '一般小児科',
          difficulty: '中級',
          totalQuestions: 10,
          correctAnswers: 8,
          timeSpent: 450,
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString()
        },
        {
          id: 'session_2',
          type: 'practice',
          category: '新生児・周産期',
          difficulty: '中級',
          totalQuestions: 5,
          correctAnswers: 4,
          timeSpent: 300,
          startedAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      return Response.json({ sessions: demoSessions });
    }

    const sql = neon(process.env.DATABASE_URL);

    let query = sql`
      SELECT 
        id, session_type, category, difficulty,
        total_questions, correct_answers, time_spent,
        started_at, completed_at
      FROM study_sessions 
      WHERE user_id = ${userId}
    `;

    if (sessionType) {
      query = sql`
        SELECT 
          id, session_type, category, difficulty,
          total_questions, correct_answers, time_spent,
          started_at, completed_at
        FROM study_sessions 
        WHERE user_id = ${userId} AND session_type = ${sessionType}
      `;
    }

    query = sql`
      ${query}
      ORDER BY started_at DESC
      LIMIT ${limit}
    `;

    const sessions = await query;

    const formattedSessions = sessions.map(session => ({
      id: session.id,
      type: session.session_type,
      category: session.category,
      difficulty: session.difficulty,
      totalQuestions: parseInt(session.total_questions),
      correctAnswers: parseInt(session.correct_answers),
      timeSpent: parseInt(session.time_spent),
      startedAt: session.started_at.toISOString(),
      completedAt: session.completed_at?.toISOString()
    }));

    return Response.json({ sessions: formattedSessions });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    return Response.json(
      { error: '学習セッションの取得に失敗しました' },
      { status: 500 }
    );
  }
}
