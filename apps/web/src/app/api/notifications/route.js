import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 通知一覧を取得
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // サーバーサイドではlocalStorageは使用できないため、空の配列を返す
      return Response.json({
        notifications: [],
        total: 0
      });
    }

    // データベースから通知を取得
    let query = 'SELECT * FROM notifications WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }

    if (status) {
      query += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex}`;
    params.push(limit);

    const result = await pool.query(query, params);

    const notifications = result.rows.map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      status: row.status,
      priority: row.priority,
      data: row.data,
      createdAt: row.created_at,
      readAt: row.read_at
    }));

    return Response.json({
      notifications,
      total: notifications.length
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    return Response.json(
      { message: '通知の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// 通知を作成
export async function POST(request) {
  try {
    const {
      type,
      title,
      message,
      priority = 'normal',
      data = {}
    } = await request.json();

    // バリデーション
    if (!type || !title || !message) {
      return Response.json(
        { message: 'タイプ、タイトル、メッセージは必須です' },
        { status: 400 }
      );
    }

    const notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      status: 'unread',
      priority,
      data,
      createdAt: new Date().toISOString(),
      readAt: null
    };

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // サーバーサイドではlocalStorageは使用できないため、通知のみを返す
      return Response.json({
        message: '通知が作成されました（デモモード）',
        notification
      });
    }

    // データベースに通知を保存
    const result = await pool.query(
      `INSERT INTO notifications (
        id, type, title, message, status, priority, data, created_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, 'unread', $4, $5, NOW()
      ) RETURNING id, created_at`,
      [type, title, message, priority, JSON.stringify(data)]
    );

    return Response.json({
      message: '通知が作成されました',
      notification: {
        id: result.rows[0].id,
        type,
        title,
        message,
        status: 'unread',
        priority,
        data,
        createdAt: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Create notification error:', error);
    return Response.json(
      { message: '通知の作成に失敗しました' },
      { status: 500 }
    );
  }
}

// 通知を既読にする
export async function PUT(request) {
  try {
    const { notificationId } = await request.json();

    if (!notificationId) {
      return Response.json(
        { message: '通知IDは必須です' },
        { status: 400 }
      );
    }

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const notificationIndex = notifications.findIndex(notif => notif.id === notificationId);
      
      if (notificationIndex !== -1) {
        notifications[notificationIndex].status = 'read';
        notifications[notificationIndex].readAt = new Date().toISOString();
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
      
      return Response.json({
        message: '通知を既読にしました'
      });
    }

    // データベースで通知を既読にする
    await pool.query(
      'UPDATE notifications SET status = $1, read_at = NOW() WHERE id = $2',
      ['read', notificationId]
    );

    return Response.json({
      message: '通知を既読にしました'
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    return Response.json(
      { message: '通知の更新に失敗しました' },
      { status: 500 }
    );
  }
}
