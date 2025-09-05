import sql from '@/app/api/utils/sql';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user basic stats
    const userResult = await sql('SELECT * FROM users WHERE id = $1', [id]);
    
    if (userResult.length === 0) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult[0];

    // Calculate accuracy
    const accuracy = user.total_answered > 0 
      ? Math.round((user.total_correct / user.total_answered) * 100)
      : 0;

    // Get study days (count distinct days with activity)
    const studyDaysResult = await sql(`
      SELECT COUNT(DISTINCT DATE(answered_at)) as study_days
      FROM study_history 
      WHERE user_id = $1
    `, [id]);

    const studyDays = studyDaysResult[0]?.study_days || 0;

    // Calculate current streak
    const streakResult = await sql(`
      WITH daily_activity AS (
        SELECT DISTINCT DATE(answered_at) as study_date
        FROM study_history 
        WHERE user_id = $1
        ORDER BY study_date DESC
      ),
      date_series AS (
        SELECT 
          study_date,
          study_date - INTERVAL '1 day' * ROW_NUMBER() OVER (ORDER BY study_date DESC) as group_date
        FROM daily_activity
      )
      SELECT COUNT(*) as streak
      FROM date_series
      WHERE group_date = (
        SELECT group_date 
        FROM date_series 
        ORDER BY study_date DESC 
        LIMIT 1
      )
    `, [id]);

    const streak = streakResult[0]?.streak || 0;

    // Get recent performance improvement
    const improvementResult = await sql(`
      WITH weekly_performance AS (
        SELECT 
          DATE_TRUNC('week', answered_at) as week,
          AVG(CASE WHEN is_correct THEN 100.0 ELSE 0.0 END) as accuracy
        FROM study_history 
        WHERE user_id = $1
          AND answered_at >= CURRENT_DATE - INTERVAL '2 weeks'
        GROUP BY DATE_TRUNC('week', answered_at)
        ORDER BY week DESC
        LIMIT 2
      )
      SELECT 
        LAG(accuracy) OVER (ORDER BY week) - accuracy as improvement
      FROM weekly_performance
      LIMIT 1
    `, [id]);

    const improvement = improvementResult[0]?.improvement || 0;

    return Response.json({
      totalAnswered: user.total_answered,
      totalCorrect: user.total_correct,
      accuracy,
      studyDays,
      streak,
      improvement: Math.round(improvement)
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return Response.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    );
  }
}