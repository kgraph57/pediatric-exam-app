import { neon } from '@neondatabase/serverless';

export async function POST(request, { params }) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { questionId, action } = body; // action: 'add' or 'remove'

    // バリデーション
    if (!questionId || !action) {
      return Response.json(
        { error: '問題IDとアクションは必須です' },
        { status: 400 }
      );
    }

    if (!['add', 'remove'].includes(action)) {
      return Response.json(
        { error: 'アクションは add または remove である必要があります' },
        { status: 400 }
      );
    }

    // データベース接続がない場合はデモレスポンスを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        message: `デモモード: 問題が${action === 'add' ? '間違い問題に追加' : '間違い問題から削除'}されました`,
        questionId,
        action
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    if (action === 'add') {
      // 間違い問題に追加
      await sql`
        INSERT INTO incorrect_questions (user_id, question_id)
        VALUES (${userId}, ${questionId})
        ON CONFLICT (user_id, question_id) DO NOTHING
      `;
    } else {
      // 間違い問題から削除
      await sql`
        DELETE FROM incorrect_questions 
        WHERE user_id = ${userId} AND question_id = ${questionId}
      `;
    }

    return Response.json({ 
      message: `問題が${action === 'add' ? '間違い問題に追加' : '間違い問題から削除'}されました`,
      questionId,
      action
    });

  } catch (error) {
    console.error('Error managing incorrect questions:', error);
    return Response.json(
      { error: '間違い問題の管理に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      const demoIncorrect = [
        {
          id: 'incorrect_1',
          questionId: 'q_3',
          question: '生後6ヶ月の乳児の発熱と咳について...',
          category: '一般小児科',
          difficulty: '初級',
          addedAt: new Date().toISOString()
        },
        {
          id: 'incorrect_2',
          questionId: 'q_4',
          question: '生後2歳の幼児の発疹について...',
          category: '感染症',
          difficulty: '中級',
          addedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      return Response.json({ incorrect: demoIncorrect });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 間違い問題を取得
    const incorrect = await sql`
      SELECT 
        iq.id,
        iq.question_id,
        q.question,
        q.category,
        q.difficulty,
        iq.created_at as added_at
      FROM incorrect_questions iq
      JOIN questions q ON iq.question_id = q.id
      WHERE iq.user_id = ${userId}
      ORDER BY iq.created_at DESC
      LIMIT ${limit}
    `;

    const formattedIncorrect = incorrect.map(inc => ({
      id: inc.id,
      questionId: inc.question_id,
      question: inc.question.substring(0, 100) + '...',
      category: inc.category,
      difficulty: inc.difficulty,
      addedAt: inc.added_at.toISOString()
    }));

    return Response.json({ incorrect: formattedIncorrect });

  } catch (error) {
    console.error('Error fetching incorrect questions:', error);
    return Response.json(
      { error: '間違い問題の取得に失敗しました' },
      { status: 500 }
    );
  }
}
