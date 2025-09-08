import { neon } from '@neondatabase/serverless';
import { hash } from 'argon2';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      name, 
      email, 
      password, 
      birthYear, 
      birthMonth, 
      birthDay, 
      prefecture, 
      hospital, 
      department, 
      experienceYears, 
      targetLevel, 
      specialty, 
      studyGoal, 
      dailyGoal, 
      weeklyGoal 
    } = body;

    // バリデーション
    if (!name || !email || !password) {
      return Response.json(
        { error: '名前、メールアドレス、パスワードは必須です' },
        { status: 400 }
      );
    }

    // データベース接続がない場合はデモモード
    if (!process.env.DATABASE_URL) {
      const demoUser = {
        id: `demo_${Date.now()}`,
        name,
        email,
        birthYear: birthYear || '1990',
        birthMonth: birthMonth || '4',
        birthDay: birthDay || '15',
        prefecture: prefecture || '東京都',
        hospital: hospital || '東京小児科病院',
        department: department || '小児科',
        experienceYears: experienceYears || '5',
        targetLevel: targetLevel || 7,
        specialty: specialty || '循環器',
        studyGoal: studyGoal || '小児科専門医取得',
        dailyGoal: dailyGoal || 15,
        weeklyGoal: weeklyGoal || 80,
        level: 1,
        total_answered: 0,
        total_correct: 0,
        streak: 0,
        createdAt: new Date().toISOString()
      };

      return Response.json({ 
        user: demoUser,
        message: 'デモモードでユーザー登録が完了しました'
      });
    }

    // メールアドレスの重複チェック
    const sql = neon(process.env.DATABASE_URL);
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

    if (existingUser.length > 0) {
      return Response.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password);

    // ユーザーを作成
    const result = await sql`
      INSERT INTO users (
        name, email, password_hash, birth_year, birth_month, birth_day,
        prefecture, hospital, department, experience_years, target_level,
        specialty, study_goal, daily_goal, weekly_goal, level,
        total_answered, total_correct, streak, created_at
      ) VALUES (
        ${name}, ${email}, ${hashedPassword}, ${birthYear || '1990'}, 
        ${birthMonth || '4'}, ${birthDay || '15'}, ${prefecture || '東京都'},
        ${hospital || '東京小児科病院'}, ${department || '小児科'}, 
        ${experienceYears || '5'}, ${targetLevel || 7}, ${specialty || '循環器'},
        ${studyGoal || '小児科専門医取得'}, ${dailyGoal || 15}, 
        ${weeklyGoal || 80}, 1, 0, 0, 0, NOW()
      ) RETURNING id, name, email, level, total_answered, total_correct, streak
    `;

    const user = result[0];

    return Response.json({ 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        total_answered: user.total_answered,
        total_correct: user.total_correct,
        streak: user.streak
      },
      message: 'ユーザー登録が完了しました'
    });

  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      { error: 'ユーザー登録に失敗しました' },
      { status: 500 }
    );
  }
}
