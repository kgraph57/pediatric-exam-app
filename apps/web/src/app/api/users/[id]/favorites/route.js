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
        message: `デモモード: 問題が${action === 'add' ? 'お気に入りに追加' : 'お気に入りから削除'}されました`,
        questionId,
        action
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    if (action === 'add') {
      // お気に入りに追加
      await sql`
        INSERT INTO favorite_questions (user_id, question_id)
        VALUES (${userId}, ${questionId})
        ON CONFLICT (user_id, question_id) DO NOTHING
      `;
    } else {
      // お気に入りから削除
      await sql`
        DELETE FROM favorite_questions 
        WHERE user_id = ${userId} AND question_id = ${questionId}
      `;
    }

    return Response.json({ 
      message: `問題が${action === 'add' ? 'お気に入りに追加' : 'お気に入りから削除'}されました`,
      questionId,
      action
    });

  } catch (error) {
    console.error('Error managing favorites:', error);
    return Response.json(
      { error: 'お気に入りの管理に失敗しました' },
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
      const demoFavorites = [
        {
          id: 'fav_1',
          questionId: 'q_1',
          question: '生後3日目の正期産児の黄疸について...',
          category: '一般小児科',
          difficulty: '中級',
          addedAt: new Date().toISOString()
        },
        {
          id: 'fav_2',
          questionId: 'q_2',
          question: '在胎38週0日、経腟分娩で出生した新生児...',
          category: '新生児・周産期',
          difficulty: '中級',
          addedAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      return Response.json({ favorites: demoFavorites });
    }

    const sql = neon(process.env.DATABASE_URL);

    // お気に入り問題を取得
    const favorites = await sql`
      SELECT 
        fq.id,
        fq.question_id,
        q.question,
        q.category,
        q.difficulty,
        fq.created_at as added_at
      FROM favorite_questions fq
      JOIN questions q ON fq.question_id = q.id
      WHERE fq.user_id = ${userId}
      ORDER BY fq.created_at DESC
      LIMIT ${limit}
    `;

    const formattedFavorites = favorites.map(fav => ({
      id: fav.id,
      questionId: fav.question_id,
      question: fav.question.substring(0, 100) + '...',
      category: fav.category,
      difficulty: fav.difficulty,
      addedAt: fav.added_at.toISOString()
    }));

    return Response.json({ favorites: formattedFavorites });

  } catch (error) {
    console.error('Error fetching favorites:', error);
    return Response.json(
      { error: 'お気に入りの取得に失敗しました' },
      { status: 500 }
    );
  }
}
