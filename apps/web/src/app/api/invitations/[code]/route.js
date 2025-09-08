import { neon } from '@neondatabase/serverless';

export async function GET(request, { params }) {
  try {
    const code = params.code;

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      const demoInvitations = {
        'PEDIATRIC2024': {
          id: 'inv_1',
          code: 'PEDIATRIC2024',
          description: '小児科専門医試験対策アプリ - 1ヶ月無料体験',
          maxUses: 50,
          usedCount: 12,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        'MEDSTUDENT2024': {
          id: 'inv_2',
          code: 'MEDSTUDENT2024',
          description: '医学生向け特別招待コード',
          maxUses: 100,
          usedCount: 25,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        }
      };

      const invitation = demoInvitations[code];
      if (!invitation) {
        return Response.json(
          { error: '招待コードが見つかりません' },
          { status: 404 }
        );
      }

      return Response.json({ invitation });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 招待コードを検索
    const result = await sql`
      SELECT 
        id, code, description, max_uses, used_count,
        expires_at, is_active
      FROM invitations 
      WHERE code = ${code}
    `;

    if (result.length === 0) {
      return Response.json(
        { error: '招待コードが見つかりません' },
        { status: 404 }
      );
    }

    const invitation = result[0];

    // 有効性チェック
    if (!invitation.is_active) {
      return Response.json(
        { error: 'この招待コードは無効です' },
        { status: 400 }
      );
    }

    if (new Date(invitation.expires_at) < new Date()) {
      return Response.json(
        { error: 'この招待コードは期限切れです' },
        { status: 400 }
      );
    }

    if (invitation.used_count >= invitation.max_uses) {
      return Response.json(
        { error: 'この招待コードの使用回数上限に達しています' },
        { status: 400 }
      );
    }

    return Response.json({ 
      invitation: {
        id: invitation.id,
        code: invitation.code,
        description: invitation.description,
        maxUses: parseInt(invitation.max_uses),
        usedCount: parseInt(invitation.used_count),
        expiresAt: invitation.expires_at.toISOString(),
        isActive: invitation.is_active
      }
    });

  } catch (error) {
    console.error('Error validating invitation:', error);
    return Response.json(
      { error: '招待コードの検証に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const code = params.code;
    const body = await request.json();
    const { userId } = body;

    // バリデーション
    if (!userId) {
      return Response.json(
        { error: 'ユーザーIDは必須です' },
        { status: 400 }
      );
    }

    // データベース接続がない場合はデモレスポンスを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        message: 'デモモード: 招待コードが使用されました',
        invitation: {
          id: 'inv_1',
          code,
          usedCount: 13
        }
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 招待コードの使用を記録
    const result = await sql`
      UPDATE invitations 
      SET used_count = used_count + 1
      WHERE code = ${code} AND is_active = true
      RETURNING id, used_count
    `;

    if (result.length === 0) {
      return Response.json(
        { error: '招待コードが見つからないか、無効です' },
        { status: 404 }
      );
    }

    // ユーザーに招待コード使用を記録
    await sql`
      INSERT INTO invitation_usage (invitation_id, user_id, used_at)
      VALUES (${result[0].id}, ${userId}, NOW())
      ON CONFLICT (invitation_id, user_id) DO NOTHING
    `;

    return Response.json({ 
      message: '招待コードが使用されました',
      invitation: {
        id: result[0].id,
        code,
        usedCount: parseInt(result[0].used_count)
      }
    });

  } catch (error) {
    console.error('Error using invitation:', error);
    return Response.json(
      { error: '招待コードの使用に失敗しました' },
      { status: 500 }
    );
  }
}
