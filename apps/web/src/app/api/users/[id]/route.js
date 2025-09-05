import { hash } from 'argon2';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ユーザー情報を取得
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // デモユーザーの場合
      if (id === 'demo') {
        return Response.json({
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
          experienceYears: '5',
          targetLevel: 7,
          specialty: '循環器',
          studyGoal: '小児科専門医取得',
          dailyGoal: 15,
          weeklyGoal: 80,
          studyTime: 'evening',
          studyFrequency: 'daily',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      }

      // ローカルストレージからユーザーを検索
      if (typeof window !== 'undefined') {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.id === id);
        
        if (user) {
          return Response.json({
            ...user,
            createdAt: user.createdAt || new Date().toISOString(),
            lastLogin: user.lastLogin || new Date().toISOString()
          });
        }
      }

      return Response.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // データベースからユーザーを取得
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    const user = result.rows[0];
    return Response.json({
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
      experienceYears: user.experience_years,
      targetLevel: user.target_level,
      specialty: user.specialty,
      studyGoal: user.study_goal,
      dailyGoal: user.daily_goal,
      weeklyGoal: user.weekly_goal,
      studyTime: user.study_time,
      studyFrequency: user.study_frequency,
      createdAt: user.created_at,
      lastLogin: user.updated_at
    });

  } catch (error) {
    console.error('Get user error:', error);
    return Response.json(
      { message: 'ユーザー情報の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// ユーザー情報を更新
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const {
      name,
      email,
      hospital,
      department,
      experienceYears,
      targetLevel,
      specialty,
      studyGoal,
      dailyGoal,
      weeklyGoal,
      studyTime,
      studyFrequency
    } = await request.json();

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // ローカルストレージからユーザーを更新
      if (typeof window !== 'undefined') {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = registeredUsers.findIndex(u => u.id === id);
        
        if (userIndex !== -1) {
          registeredUsers[userIndex] = {
            ...registeredUsers[userIndex],
            name,
            email,
            hospital,
            department,
            experienceYears,
            targetLevel,
            specialty,
            studyGoal,
            dailyGoal,
            weeklyGoal,
            studyTime,
            studyFrequency,
            lastLogin: new Date().toISOString()
          };
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          
          return Response.json({
            message: 'ユーザー情報が更新されました',
            user: registeredUsers[userIndex]
          });
        }
      }

      return Response.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // データベースでユーザーを更新
    const result = await pool.query(
      `UPDATE users SET 
        name = $1, email = $2, hospital = $3, department = $4,
        experience_years = $5, target_level = $6, specialty = $7,
        study_goal = $8, daily_goal = $9, weekly_goal = $10,
        study_time = $11, study_frequency = $12, updated_at = NOW()
      WHERE id = $13
      RETURNING id, name, email, hospital, department, level`,
      [
        name, email, hospital, department, experienceYears, targetLevel,
        specialty, studyGoal, dailyGoal, weeklyGoal, studyTime, studyFrequency, id
      ]
    );

    if (result.rows.length === 0) {
      return Response.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    const user = result.rows[0];
    return Response.json({
      message: 'ユーザー情報が更新されました',
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
    console.error('Update user error:', error);
    return Response.json(
      { message: 'ユーザー情報の更新に失敗しました' },
      { status: 500 }
    );
  }
}

// ユーザーを削除
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // ローカルストレージからユーザーを削除
      if (typeof window !== 'undefined') {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const updatedUsers = registeredUsers.filter(u => u.id !== id);
        localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
        
        return Response.json({
          message: 'ユーザーが削除されました'
        });
      }

      return Response.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // データベースからユーザーを削除
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return Response.json(
        { message: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'ユーザーが削除されました'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return Response.json(
      { message: 'ユーザーの削除に失敗しました' },
      { status: 500 }
    );
  }
}