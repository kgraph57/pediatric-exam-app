import { neon } from '@neondatabase/serverless';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      const demoUsers = [
        {
          id: 'demo_user_1',
          name: '田中太郎',
          email: 'tanaka@example.com',
          hospital: '東京小児科病院',
          department: '小児科',
          level: 3,
          total_answered: 150,
          total_correct: 120,
          streak: 5,
          created_at: new Date().toISOString()
        },
        {
          id: 'demo_user_2',
          name: '佐藤花子',
          email: 'sato@example.com',
          hospital: '大阪小児科クリニック',
          department: '小児科',
          level: 2,
          total_answered: 80,
          total_correct: 65,
          streak: 3,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ];

      return Response.json({
        users: demoUsers,
        total: demoUsers.length,
        page,
        limit,
        totalPages: 1
      });
    }

    // 実際のデータベースからユーザーを取得
    const sql = neon(process.env.DATABASE_URL);
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params = [];
    
    if (search) {
      whereClause = 'WHERE name ILIKE $1 OR email ILIKE $1';
      params.push(`%${search}%`);
    }
    
    const users = await sql`
      SELECT 
        id, name, email, hospital, department, level,
        total_answered, total_correct, streak, created_at
      FROM users 
      ${sql.unsafe(whereClause)}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const totalResult = await sql`
      SELECT COUNT(*) as total FROM users 
      ${sql.unsafe(whereClause)}
    `;
    
    const total = parseInt(totalResult[0].total);
    const totalPages = Math.ceil(total / limit);

    return Response.json({
      users,
      total,
      page,
      limit,
      totalPages
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json(
      { error: 'ユーザー一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}
