import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 招待コードの検証
export async function GET(request, { params }) {
  try {
    const { code } = params;

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // デモ用の招待コードをチェック
      const demoInvitations = [
        {
          code: 'DEMO123',
          email: 'demo@example.com',
          name: 'デモユーザー',
          hospital: '東京小児科病院',
          department: '小児科',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30日後
          usedAt: null
        }
      ];

      const invitation = demoInvitations.find(inv => inv.code === code);

      if (!invitation) {
        return Response.json(
          { message: '招待コードが見つかりません' },
          { status: 404 }
        );
      }

      if (invitation.usedAt) {
        return Response.json(
          { message: 'この招待コードは既に使用されています' },
          { status: 400 }
        );
      }

      if (new Date(invitation.expiresAt) < new Date()) {
        return Response.json(
          { message: 'この招待コードは期限切れです' },
          { status: 400 }
        );
      }

      return Response.json({
        valid: true,
        invitation: {
          code: invitation.code,
          email: invitation.email,
          name: invitation.name,
          hospital: invitation.hospital,
          department: invitation.department
        }
      });
    }

    // データベースから招待コードを検索
    const result = await pool.query(
      'SELECT * FROM invitations WHERE code = $1',
      [code]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { message: '招待コードが見つかりません' },
        { status: 404 }
      );
    }

    const invitation = result.rows[0];

    if (invitation.used_at) {
      return Response.json(
        { message: 'この招待コードは既に使用されています' },
        { status: 400 }
      );
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return Response.json(
        { message: 'この招待コードは期限切れです' },
        { status: 400 }
      );
    }

    return Response.json({
      valid: true,
      invitation: {
        code: invitation.code,
        email: invitation.email,
        name: invitation.name,
        hospital: invitation.hospital,
        department: invitation.department
      }
    });

  } catch (error) {
    console.error('Validate invitation error:', error);
    return Response.json(
      { message: '招待コードの検証に失敗しました' },
      { status: 500 }
    );
  }
}

// 招待コードを使用してユーザー登録
export async function POST(request, { params }) {
  try {
    const { code } = params;
    const { password } = await request.json();

    if (!password) {
      return Response.json(
        { message: 'パスワードは必須です' },
        { status: 400 }
      );
    }

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // デモ用の招待コードをチェック
      const demoInvitations = [
        {
          code: 'DEMO123',
          email: 'demo@example.com',
          name: 'デモユーザー',
          hospital: '東京小児科病院',
          department: '小児科',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30日後
          usedAt: null
        }
      ];

      const invitation = demoInvitations.find(inv => inv.code === code);

      if (!invitation) {
        return Response.json(
          { message: '招待コードが見つかりません' },
          { status: 404 }
        );
      }

      if (invitation.usedAt) {
        return Response.json(
          { message: 'この招待コードは既に使用されています' },
          { status: 400 }
        );
      }

      if (new Date(invitation.expiresAt) < new Date()) {
        return Response.json(
          { message: 'この招待コードは期限切れです' },
          { status: 400 }
        );
      }

      // ユーザーを作成
      const newUser = {
        id: Date.now().toString(),
        name: invitation.name,
        email: invitation.email,
        hospital: invitation.hospital,
        department: invitation.department,
        level: 1,
        totalAnswered: 0,
        totalCorrect: 0,
        streak: 0,
        longestStreak: 0,
        experienceYears: '',
        targetLevel: 5,
        specialty: '',
        studyGoal: '',
        dailyGoal: 15,
        weeklyGoal: 80,
        studyTime: 'evening',
        studyFrequency: 'daily',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      return Response.json({
        message: 'ユーザー登録が完了しました',
        user: newUser
      });
    }

    // データベースで招待コードを検証
    const invitationResult = await pool.query(
      'SELECT * FROM invitations WHERE code = $1',
      [code]
    );

    if (invitationResult.rows.length === 0) {
      return Response.json(
        { message: '招待コードが見つかりません' },
        { status: 404 }
      );
    }

    const invitation = invitationResult.rows[0];

    if (invitation.used_at) {
      return Response.json(
        { message: 'この招待コードは既に使用されています' },
        { status: 400 }
      );
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return Response.json(
        { message: 'この招待コードは期限切れです' },
        { status: 400 }
      );
    }

    // パスワードをハッシュ化
    const { hash } = await import('argon2');
    const hashedPassword = await hash(password);

    // ユーザーを作成
    const userResult = await pool.query(
      `INSERT INTO users (
        id, name, email, password_hash, hospital, department, 
        level, total_answered, total_correct, streak, longest_streak,
        created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, 1, 0, 0, 0, 0, NOW(), NOW()
      ) RETURNING id, name, email, hospital, department, level`,
      [
        invitation.name, invitation.email, hashedPassword,
        invitation.hospital, invitation.department
      ]
    );

    const user = userResult.rows[0];

    // 招待コードを使用済みにマーク
    await pool.query(
      'UPDATE invitations SET used_at = NOW() WHERE code = $1',
      [code]
    );

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
    console.error('Register with invitation error:', error);
    return Response.json(
      { message: 'ユーザー登録に失敗しました' },
      { status: 500 }
    );
  }
}
