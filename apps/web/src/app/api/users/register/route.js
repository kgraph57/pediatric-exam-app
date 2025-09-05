import { hash } from 'argon2';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    const {
      name,
      email,
      password,
      hospital,
      department,
      experienceYears,
      targetLevel,
      specialty,
      studyGoal,
      dailyGoal,
      weeklyGoal
    } = await request.json();

    // バリデーション
    if (!name || !email || !password) {
      return Response.json(
        { message: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { message: 'パスワードは6文字以上で入力してください' },
        { status: 400 }
      );
    }

    // データベースが利用できない場合のデモ登録
    if (!process.env.DATABASE_URL) {
      // ローカルストレージに保存（デモ用）
      const newUser = {
        id: `user_${Date.now()}`,
        name,
        email,
        password, // デモ用にパスワードも保存
        hospital: hospital || '',
        department: department || '',
        experienceYears: experienceYears || '',
        targetLevel: targetLevel || 5,
        specialty: specialty || '',
        studyGoal: studyGoal || '',
        dailyGoal: dailyGoal || 15,
        weeklyGoal: weeklyGoal || 80,
        level: 1,
        totalAnswered: 0,
        totalCorrect: 0,
        streak: 0,
        longestStreak: 0,
        birthYear: '1990',
        birthMonth: '4',
        birthDay: '15',
        prefecture: '東京都',
        studyTime: 'evening',
        studyFrequency: 'daily',
        categoryStats: [],
        createdAt: new Date().toISOString()
      };

      return Response.json({
        message: 'ユーザー登録が完了しました（デモモード）',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          hospital: newUser.hospital,
          department: newUser.department,
          level: newUser.level,
          totalAnswered: newUser.totalAnswered,
          totalCorrect: newUser.totalCorrect,
          streak: newUser.streak,
          longestStreak: newUser.longestStreak,
          birthYear: newUser.birthYear,
          birthMonth: newUser.birthMonth,
          birthDay: newUser.birthDay,
          prefecture: newUser.prefecture,
          experienceYears: newUser.experienceYears,
          targetLevel: newUser.targetLevel,
          specialty: newUser.specialty,
          studyGoal: newUser.studyGoal,
          dailyGoal: newUser.dailyGoal,
          weeklyGoal: newUser.weeklyGoal,
          studyTime: newUser.studyTime,
          studyFrequency: newUser.studyFrequency,
          categoryStats: newUser.categoryStats
        }
      });
    }

    // メールアドレスの重複チェック
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return Response.json(
        { message: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      );
    }

    // パスワードをハッシュ化
    const hashedPassword = await hash(password);

    // ユーザーを作成
    const result = await pool.query(
      `INSERT INTO users (
        id, name, email, password_hash, hospital, department, 
        experience_years, target_level, specialty, study_goal, 
        daily_goal, weekly_goal, level, total_answered, total_correct, 
        streak, longest_streak, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 
        1, 0, 0, 0, 0, NOW(), NOW()
      ) RETURNING id, name, email, hospital, department, level`,
      [
        name, email, hashedPassword, hospital, department,
        experienceYears, targetLevel, specialty, studyGoal,
        dailyGoal, weeklyGoal
      ]
    );

    const user = result.rows[0];

    return Response.json({
      message: 'ユーザー登録が完了しました',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        hospital: user.hospital,
        department: user.department,
        level: user.level
      }
    });

  } catch (error) {
    console.error('User registration error:', error);
    return Response.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
