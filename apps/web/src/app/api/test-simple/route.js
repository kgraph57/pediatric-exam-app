import sql from '@/app/api/utils/sql';

export async function POST(request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return Response.json(
        { error: '名前とメールアドレスは必須です' },
        { status: 400 }
      );
    }

    // ユーザーIDを生成（emailベース）
    const userId = `test_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // テストユーザーを作成
    const result = await sql(`
      INSERT INTO users (
        id, email, name, level, total_answered, total_correct, streak, longest_streak,
        birth_year, birth_month, birth_day, prefecture, hospital, department,
        experience_years, target_level, specialty, study_goal, daily_goal,
        weekly_goal, study_time, study_frequency
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      )
      RETURNING *
    `, [
      userId, email, name, 1, 0, 0, 0, 0,
      '1990', '1', '1', '東京都', 'テスト病院', '小児科',
      '1', 5, '一般', '小児科専門医取得', 10, 50,
      'evening', 'daily'
    ]);

    return Response.json({
      success: true,
      user: result[0],
      message: 'テストユーザーが作成されました'
    });

  } catch (error) {
    console.error('Error creating test user:', error);
    return Response.json(
      { error: 'テストユーザーの作成に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await sql(`
      SELECT id, email, name, level, total_answered, total_correct, streak, created_at
      FROM users 
      WHERE id LIKE 'test_%'
      ORDER BY created_at DESC
      LIMIT 10
    `);

    return Response.json({
      users: result,
      total: result.length
    });

  } catch (error) {
    console.error('Error fetching test users:', error);
    return Response.json(
      { error: 'テストユーザーの取得に失敗しました' },
      { status: 500 }
    );
  }
}


