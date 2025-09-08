import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      const demoInvitations = [
        {
          id: 'inv_1',
          code: 'PEDIATRIC2024',
          description: '小児科専門医試験対策アプリ - 1ヶ月無料体験',
          maxUses: 50,
          usedCount: 12,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          isActive: true
        },
        {
          id: 'inv_2',
          code: 'MEDSTUDENT2024',
          description: '医学生向け特別招待コード',
          maxUses: 100,
          usedCount: 25,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        }
      ];

      return Response.json({ invitations: demoInvitations });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 招待コード一覧を取得
    const invitations = await sql`
      SELECT 
        id, code, description, max_uses, used_count,
        expires_at, created_at, is_active
      FROM invitations
      ORDER BY created_at DESC
    `;

    const formattedInvitations = invitations.map(inv => ({
      id: inv.id,
      code: inv.code,
      description: inv.description,
      maxUses: parseInt(inv.max_uses),
      usedCount: parseInt(inv.used_count),
      expiresAt: inv.expires_at.toISOString(),
      createdAt: inv.created_at.toISOString(),
      isActive: inv.is_active
    }));

    return Response.json({ invitations: formattedInvitations });

  } catch (error) {
    console.error('Error fetching invitations:', error);
    return Response.json(
      { error: '招待コード一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, description, maxUses, expiresAt } = body;

    // バリデーション
    if (!code || !description) {
      return Response.json(
        { error: '招待コードと説明は必須です' },
        { status: 400 }
      );
    }

    // データベース接続がない場合はデモレスポンスを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        message: 'デモモード: 招待コードが作成されました',
        invitation: {
          id: `inv_${Date.now()}`,
          code,
          description,
          maxUses: maxUses || 50,
          usedCount: 0,
          expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          isActive: true
        }
      });
    }

    const sql = neon(process.env.DATABASE_URL);

    // 招待コードの重複チェック
    const existingInvitation = await sql`
      SELECT id FROM invitations WHERE code = ${code}
    `;

    if (existingInvitation.length > 0) {
      return Response.json(
        { error: 'この招待コードは既に存在します' },
        { status: 400 }
      );
    }

    // 招待コードを作成
    const result = await sql`
      INSERT INTO invitations (
        code, description, max_uses, expires_at, created_at, is_active
      ) VALUES (
        ${code}, ${description}, ${maxUses || 50}, 
        ${expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()},
        NOW(), true
      ) RETURNING id, code, description, max_uses, used_count,
                expires_at, created_at, is_active
    `;

    const invitation = result[0];

    return Response.json({ 
      message: '招待コードが作成されました',
      invitation: {
        id: invitation.id,
        code: invitation.code,
        description: invitation.description,
        maxUses: parseInt(invitation.max_uses),
        usedCount: parseInt(invitation.used_count),
        expiresAt: invitation.expires_at.toISOString(),
        createdAt: invitation.created_at.toISOString(),
        isActive: invitation.is_active
      }
    });

  } catch (error) {
    console.error('Error creating invitation:', error);
    return Response.json(
      { error: '招待コードの作成に失敗しました' },
      { status: 500 }
    );
  }
}
