import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// バックアップを作成
export async function POST(request) {
  try {
    const { name, description } = await request.json();

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      const backupData = {
        users: [],
        invitations: [],
        logs: [],
        notifications: [],
        userProgress: {},
        currentUser: {}
      };

      const backup = {
        id: Date.now().toString(),
        name: name || `バックアップ_${new Date().toISOString().split('T')[0]}`,
        description: description || '',
        data: backupData,
        createdAt: new Date().toISOString(),
        size: JSON.stringify(backupData).length
      };

      // サーバーサイドではlocalStorageは使用できないため、バックアップのみを返す
      return Response.json({
        message: 'バックアップが作成されました（デモモード）',
        backup: {
          id: backup.id,
          name: backup.name,
          description: backup.description,
          createdAt: backup.createdAt,
          size: backup.size
        }
      });
    }

    // データベースからバックアップを作成
    const usersResult = await pool.query('SELECT * FROM users');
    const invitationsResult = await pool.query('SELECT * FROM invitations');
    const logsResult = await pool.query('SELECT * FROM usage_logs');
    const notificationsResult = await pool.query('SELECT * FROM notifications');
    const progressResult = await pool.query('SELECT * FROM study_history');

    const backupData = {
      users: usersResult.rows,
      invitations: invitationsResult.rows,
      logs: logsResult.rows,
      notifications: notificationsResult.rows,
      studyHistory: progressResult.rows
    };

    const backup = {
      id: Date.now().toString(),
      name: name || `バックアップ_${new Date().toISOString().split('T')[0]}`,
      description: description || '',
      data: backupData,
      createdAt: new Date().toISOString(),
      size: JSON.stringify(backupData).length
    };

    // バックアップをデータベースに保存（実際の実装では別のテーブルに保存）
    await pool.query(
      `INSERT INTO backups (id, name, description, data, created_at, size)
       VALUES ($1, $2, $3, $4, NOW(), $5)`,
      [backup.id, backup.name, backup.description, JSON.stringify(backupData), backup.size]
    );

    return Response.json({
      message: 'バックアップが作成されました',
      backup: {
        id: backup.id,
        name: backup.name,
        description: backup.description,
        createdAt: backup.createdAt,
        size: backup.size
      }
    });

  } catch (error) {
    console.error('Backup creation error:', error);
    return Response.json(
      { message: 'バックアップの作成に失敗しました' },
      { status: 500 }
    );
  }
}

// バックアップ一覧を取得
export async function GET(request) {
  try {
    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // サーバーサイドではlocalStorageは使用できないため、空の配列を返す
      return Response.json({
        backups: [],
        total: 0
      });
    }

    // データベースからバックアップ一覧を取得
    const result = await pool.query(
      'SELECT id, name, description, created_at, size FROM backups ORDER BY created_at DESC'
    );

    const backups = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at,
      size: row.size
    }));

    return Response.json({
      backups,
      total: backups.length
    });

  } catch (error) {
    console.error('Get backups error:', error);
    return Response.json(
      { message: 'バックアップ一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}
