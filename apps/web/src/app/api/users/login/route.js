import { verify } from 'argon2';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // バリデーション
    if (!email || !password) {
      return Response.json(
        { message: 'メールアドレスとパスワードを入力してください' },
        { status: 400 }
      );
    }

    // データベースが利用できない場合のデモログイン
    if (!process.env.DATABASE_URL) {
      // デモユーザーのチェック
      if (email === 'demo@example.com' && password === 'demo123') {
        const demoUser = {
          id: 'demo',
          name: 'デモユーザー',
          email: 'demo@example.com',
          hospital: '東京小児科病院',
          department: '小児科',
          level: 3,
          totalAnswered: 0,
          totalCorrect: 0,
          streak: 0,
          longestStreak: 0,
          birthYear: '1990',
          birthMonth: '4',
          birthDay: '15',
          prefecture: '東京都',
          experienceYears: '5',
          targetLevel: 7,
          specialty: '循環器',
          studyGoal: '小児科専門医取得',
          dailyGoal: 15,
          weeklyGoal: 80,
          studyTime: 'evening',
          studyFrequency: 'daily',
          categoryStats: []
        };

        return Response.json({
          message: 'ログインが完了しました（デモモード）',
          user: demoUser
        });
      }

      // ローカルストレージからユーザーを検索（デモ用）
      if (typeof window !== 'undefined') {
        const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = savedUsers.find(u => u.email === email);
        
        if (user && user.password === password) {
          return Response.json({
            message: 'ログインが完了しました（デモモード）',
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              hospital: user.hospital,
              department: user.department,
              level: user.level,
              totalAnswered: user.totalAnswered || 0,
              totalCorrect: user.totalCorrect || 0,
              streak: user.streak || 0,
              longestStreak: user.longestStreak || 0,
              birthYear: user.birthYear || '1990',
              birthMonth: user.birthMonth || '4',
              birthDay: user.birthDay || '15',
              prefecture: user.prefecture || '東京都',
              experienceYears: user.experienceYears || '',
              targetLevel: user.targetLevel || 5,
              specialty: user.specialty || '',
              studyGoal: user.studyGoal || '',
              dailyGoal: user.dailyGoal || 15,
              weeklyGoal: user.weeklyGoal || 80,
              studyTime: user.studyTime || 'evening',
              studyFrequency: user.studyFrequency || 'daily',
              categoryStats: user.categoryStats || []
            }
          });
        }
      }

      return Response.json(
        { message: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // データベースからユーザーを検索
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return Response.json(
        { message: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    const user = userResult.rows[0];

    // パスワードの検証
    const isValidPassword = await verify(user.password_hash, password);
    if (!isValidPassword) {
      return Response.json(
        { message: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // ログイン成功
    return Response.json({
      message: 'ログインが完了しました',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        hospital: user.hospital,
        department: user.department,
        level: user.level,
        totalAnswered: user.total_answered,
        totalCorrect: user.total_correct,
        streak: user.streak,
        longestStreak: user.longest_streak,
        birthYear: user.birth_year,
        birthMonth: user.birth_month,
        birthDay: user.birth_day,
        prefecture: user.prefecture,
        experienceYears: user.experience_years,
        targetLevel: user.target_level,
        specialty: user.specialty,
        studyGoal: user.study_goal,
        dailyGoal: user.daily_goal,
        weeklyGoal: user.weekly_goal,
        studyTime: user.study_time,
        studyFrequency: user.study_frequency,
        categoryStats: []
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { message: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
