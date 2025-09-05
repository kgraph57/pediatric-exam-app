import { Pool } from '@neondatabase/serverless';
import { randomBytes } from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 招待コードを生成
function generateInvitationCode() {
  return randomBytes(8).toString('hex').toUpperCase();
}

// 招待コード一覧を取得
export async function GET(request) {
  try {
    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // サーバーサイドではlocalStorageは使用できないため、空の配列を返す
      return Response.json({
        invitations: [],
        total: 0
      });
    }

    // データベースから招待コードを取得
    const result = await pool.query(`
      SELECT 
        id, code, email, name, hospital, department,
        created_at, expires_at, used_at, created_by
      FROM invitations 
      ORDER BY created_at DESC
    `);

    const invitations = result.rows.map(row => ({
      id: row.id,
      code: row.code,
      email: row.email,
      name: row.name,
      hospital: row.hospital,
      department: row.department,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      usedAt: row.used_at,
      createdBy: row.created_by,
      status: row.used_at ? 'used' : (new Date(row.expires_at) < new Date() ? 'expired' : 'active')
    }));

    return Response.json({
      invitations,
      total: invitations.length
    });

  } catch (error) {
    console.error('Get invitations error:', error);
    return Response.json(
      { message: '招待コード一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 新しい招待コードを作成
export async function POST(request) {
  try {
    const {
      email,
      name,
      hospital,
      department,
      expiresInDays = 30
    } = await request.json();

    // バリデーション
    if (!email || !name) {
      return Response.json(
        { message: 'メールアドレスと名前は必須です' },
        { status: 400 }
      );
    }

    const invitationCode = generateInvitationCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      const invitation = {
        id: Date.now().toString(),
        code: invitationCode,
        email,
        name,
        hospital: hospital || '',
        department: department || '',
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt.toISOString(),
        usedAt: null,
        createdBy: 'admin',
        status: 'active'
      };

      // サーバーサイドではlocalStorageは使用できないため、作成した招待コードのみを返す
      return Response.json({
        message: '招待コードが作成されました（デモモード）',
        invitation
      });
    }

    // データベースに招待コードを保存
    const result = await pool.query(
      `INSERT INTO invitations (
        id, code, email, name, hospital, department,
        created_at, expires_at, created_by
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, NOW(), $6, 'admin'
      ) RETURNING id, code, created_at`,
      [invitationCode, email, name, hospital, department, expiresAt]
    );

    const invitation = result.rows[0];

    return Response.json({
      message: '招待コードが作成されました',
      invitation: {
        id: invitation.id,
        code: invitation.code,
        email,
        name,
        hospital: hospital || '',
        department: department || '',
        createdAt: invitation.created_at,
        expiresAt: expiresAt.toISOString(),
        status: 'active'
      }
    });

  } catch (error) {
    console.error('Create invitation error:', error);
    return Response.json(
      { message: '招待コードの作成に失敗しました' },
      { status: 500 }
    );
  }
}
