import sql from '@/app/api/utils/sql';

export async function GET(request) {
  try {
    // データベースからユーザー一覧を取得
    const result = await sql(`
      SELECT 
        id, name, email, hospital, department, level,
        total_answered, total_correct, streak, longest_streak,
        experience_years, target_level, specialty, study_goal,
        daily_goal, weekly_goal, study_time, study_frequency,
        created_at, updated_at
      FROM users 
      ORDER BY created_at DESC
    `);

    const users = result.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      hospital: row.hospital,
      department: row.department,
      level: row.level,
      totalAnswered: row.total_answered,
      totalCorrect: row.total_correct,
      streak: row.streak,
      longestStreak: row.longest_streak,
      experienceYears: row.experience_years,
      targetLevel: row.target_level,
      specialty: row.specialty,
      studyGoal: row.study_goal,
      dailyGoal: row.daily_goal,
      weeklyGoal: row.weekly_goal,
      studyTime: row.study_time,
      studyFrequency: row.study_frequency,
      createdAt: row.created_at,
      lastLogin: row.updated_at
    }));

    return Response.json({
      users,
      total: users.length
    });

  } catch (error) {
    console.error('User list error:', error);
    return Response.json(
      { message: 'ユーザー一覧の取得に失敗しました' },
      { status: 500 }
    );
  }
}
