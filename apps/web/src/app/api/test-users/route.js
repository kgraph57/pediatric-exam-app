import sql from '@/app/api/utils/sql';

// テストユーザーの作成
export async function POST(request) {
  try {
    const { name, email, profile } = await request.json();

    if (!name || !email) {
      return Response.json(
        { error: '名前とメールアドレスは必須です' },
        { status: 400 }
      );
    }

    // ユーザーIDを生成（emailベース）
    const userId = `test_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;

    // デフォルトプロフィール
    const defaultProfile = {
      name,
      email,
      level: 1,
      total_answered: 0,
      total_correct: 0,
      streak: 0,
      longest_streak: 0,
      birth_year: '1990',
      birth_month: '1',
      birth_day: '1',
      prefecture: '東京都',
      hospital: 'テスト病院',
      department: '小児科',
      experience_years: '1',
      target_level: 5,
      specialty: '一般',
      study_goal: '小児科専門医取得',
      daily_goal: 10,
      weekly_goal: 50,
      study_time: 'evening',
      study_frequency: 'daily',
      ...profile // カスタムプロフィールで上書き
    };

    // ユーザーを作成
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
      userId, defaultProfile.email, defaultProfile.name, defaultProfile.level,
      defaultProfile.total_answered, defaultProfile.total_correct, defaultProfile.streak,
      defaultProfile.longest_streak, defaultProfile.birth_year, defaultProfile.birth_month,
      defaultProfile.birth_day, defaultProfile.prefecture, defaultProfile.hospital,
      defaultProfile.department, defaultProfile.experience_years, defaultProfile.target_level,
      defaultProfile.specialty, defaultProfile.study_goal, defaultProfile.daily_goal,
      defaultProfile.weekly_goal, defaultProfile.study_time, defaultProfile.study_frequency
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

// テストユーザーの一覧取得
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;

    const result = await sql(`
      SELECT id, email, name, level, total_answered, total_correct, streak, created_at
      FROM users 
      WHERE id LIKE 'test_%'
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);

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

