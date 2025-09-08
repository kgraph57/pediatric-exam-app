import { neon } from '@neondatabase/serverless';

export async function GET(request, { params }) {
  try {
    const userId = params.id;

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      const demoUser = {
        id: userId,
        name: 'デモユーザー',
        email: 'demo@example.com',
        hospital: '東京小児科病院',
        department: '小児科',
        experience_years: 5,
        target_level: 7,
        specialty: '循環器',
        study_goal: '小児科専門医取得',
        daily_goal: 15,
        weekly_goal: 80,
        level: 3,
        total_answered: 150,
        total_correct: 120,
        streak: 5,
        created_at: new Date().toISOString()
      };

      return Response.json({ user: demoUser });
    }

    // 実際のデータベースからユーザーを取得
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`
      SELECT 
        id, name, email, hospital, department, experience_years,
        target_level, specialty, study_goal, daily_goal, weekly_goal,
        level, total_answered, total_correct, streak, created_at
      FROM users 
      WHERE id = ${userId}
    `;

    if (result.length === 0) {
      return Response.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    return Response.json({ user: result[0] });

  } catch (error) {
    console.error('Error fetching user:', error);
    return Response.json(
      { error: 'ユーザー情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const userId = params.id;
    const body = await request.json();
    const { 
      name, hospital, department, experience_years, target_level,
      specialty, study_goal, daily_goal, weekly_goal 
    } = body;

    // データベース接続がない場合はデモレスポンスを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        message: 'デモモード: ユーザー情報が更新されました',
        user: {
          id: userId,
          name: name || 'デモユーザー',
          hospital: hospital || '東京小児科病院',
          department: department || '小児科',
          experience_years: experience_years || 5,
          target_level: target_level || 7,
          specialty: specialty || '循環器',
          study_goal: study_goal || '小児科専門医取得',
          daily_goal: daily_goal || 15,
          weekly_goal: weekly_goal || 80
        }
      });
    }

    // 実際のデータベースでユーザー情報を更新
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`
      UPDATE users SET
        name = ${name},
        hospital = ${hospital},
        department = ${department},
        experience_years = ${experience_years},
        target_level = ${target_level},
        specialty = ${specialty},
        study_goal = ${study_goal},
        daily_goal = ${daily_goal},
        weekly_goal = ${weekly_goal},
        updated_at = NOW()
      WHERE id = ${userId}
      RETURNING id, name, hospital, department, experience_years,
                target_level, specialty, study_goal, daily_goal, weekly_goal
    `;

    if (result.length === 0) {
      return Response.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    return Response.json({ 
      message: 'ユーザー情報が更新されました',
      user: result[0]
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return Response.json(
      { error: 'ユーザー情報の更新に失敗しました' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const userId = params.id;

    // データベース接続がない場合はデモレスポンスを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        message: 'デモモード: ユーザーが削除されました'
      });
    }

    // 実際のデータベースからユーザーを削除
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql`
      DELETE FROM users WHERE id = ${userId}
      RETURNING id, name, email
    `;

    if (result.length === 0) {
      return Response.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    return Response.json({ 
      message: 'ユーザーが削除されました',
      user: result[0]
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return Response.json(
      { error: 'ユーザーの削除に失敗しました' },
      { status: 500 }
    );
  }
}
