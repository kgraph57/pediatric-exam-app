import { neon } from '@neondatabase/serverless';

export async function POST(request, { params }) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { questionId, isCorrect, timeSpent, category, difficulty } = body;

    // バリデーション
    if (!questionId || typeof isCorrect !== 'boolean') {
      return Response.json(
        { error: '問題IDと正解フラグは必須です' },
        { status: 400 }
      );
    }

    // データベース接続がない場合はデモレスポンスを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        message: 'デモモード: 学習進捗が保存されました',
        progress: {
          questionId,
          isCorrect,
          timeSpent: timeSpent || 0,
          answeredAt: new Date().toISOString()
        }
      });
    }

    // 学習履歴を保存
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO study_history (
        user_id, question_id, category, difficulty, is_correct, time_spent
      ) VALUES (
        ${userId}, ${questionId}, ${category || null}, 
        ${difficulty || null}, ${isCorrect}, ${timeSpent || 0}
      ) ON CONFLICT (user_id, question_id) DO UPDATE SET
        is_correct = EXCLUDED.is_correct,
        time_spent = EXCLUDED.time_spent,
        answered_at = NOW()
    `;

    // ユーザー進捗テーブルにも保存
    await sql`
      INSERT INTO user_progress (
        user_id, question_id, is_correct, time_spent
      ) VALUES (
        ${userId}, ${questionId}, ${isCorrect}, ${timeSpent || 0}
      ) ON CONFLICT (user_id, question_id) DO UPDATE SET
        is_correct = EXCLUDED.is_correct,
        time_spent = EXCLUDED.time_spent,
        answered_at = NOW()
    `;

    // ユーザー統計を更新
    await sql`SELECT update_user_stats(${userId})`;

    return Response.json({ 
      message: '学習進捗が保存されました'
    });

  } catch (error) {
    console.error('Error saving progress:', error);
    return Response.json(
      { error: '学習進捗の保存に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      const demoProgress = [
        {
          id: 'progress_1',
          questionId: 'q_1',
          category: '一般小児科',
          difficulty: '中級',
          isCorrect: true,
          timeSpent: 45,
          answeredAt: new Date().toISOString()
        },
        {
          id: 'progress_2',
          questionId: 'q_2',
          category: '新生児・周産期',
          difficulty: '中級',
          isCorrect: false,
          timeSpent: 60,
          answeredAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      return Response.json({ progress: demoProgress });
    }

    // 実際のデータベースから学習進捗を取得
    const sql = neon(process.env.DATABASE_URL);
    let query = sql`
      SELECT 
        sh.id, sh.question_id, sh.category, sh.difficulty,
        sh.is_correct, sh.time_spent, sh.answered_at
      FROM study_history sh
      WHERE sh.user_id = ${userId}
    `;

    if (category) {
      query = sql`
        SELECT 
          sh.id, sh.question_id, sh.category, sh.difficulty,
          sh.is_correct, sh.time_spent, sh.answered_at
        FROM study_history sh
        WHERE sh.user_id = ${userId} AND sh.category = ${category}
      `;
    }

    query = sql`
      ${query}
      ORDER BY sh.answered_at DESC
      LIMIT ${limit}
    `;

    const progress = await query;

    return Response.json({ progress });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return Response.json(
      { error: '学習進捗の取得に失敗しました' },
      { status: 500 }
    );
  }
}
