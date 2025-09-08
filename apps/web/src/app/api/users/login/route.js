import { neon } from '@neondatabase/serverless';
import { verify } from 'argon2';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // バリデーション
    if (!email || !password) {
      return Response.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      );
    }

    // データベース接続がない場合はデモモード
    if (!process.env.DATABASE_URL) {
      const demoUser = {
        id: 'demo_user',
        name: 'デモユーザー',
        email: email,
        level: 3,
        total_answered: 150,
        total_correct: 120,
        streak: 5,
        birthYear: '1990',
        birthMonth: '4',
        birthDay: '15',
        prefecture: '東京都',
        hospital: '東京小児科病院',
        department: '小児科',
        experienceYears: '5',
        targetLevel: 7,
        specialty: '循環器',
        studyGoal: '小児科専門医取得',
        dailyGoal: 15,
        weeklyGoal: 80
      };

      return Response.json({ 
        user: demoUser,
        message: 'デモモードでログインしました'
      });
    }

    // ユーザーを検索
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`
      SELECT id, name, email, password_hash, level, total_answered, total_correct, streak
      FROM users 
      WHERE email = ${email}
    `;

    if (result.length === 0) {
      return Response.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    const user = result[0];

    // パスワードの検証
    const isValidPassword = await verify(user.password_hash, password);
    
    if (!isValidPassword) {
      return Response.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

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
      message: 'ログインしました'
    });

  } catch (error) {
    console.error('Error logging in user:', error);
    return Response.json(
      { error: 'ログインに失敗しました' },
      { status: 500 }
    );
  }
}
