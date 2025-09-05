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

    // Get study history for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const studyHistoryResult = await sql(`
      SELECT DISTINCT DATE(answered_at) as study_date
      FROM study_history 
      WHERE user_id = $1 AND answered_at >= $2
      ORDER BY study_date DESC
    `, [id, thirtyDaysAgo.toISOString()]);

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

    const currentStreak = streakResult[0]?.streak || 0;

    // Get longest streak
    const longestStreakResult = await sql(`
      WITH daily_activity AS (
        SELECT DISTINCT DATE(answered_at) as study_date
        FROM study_history 
        WHERE user_id = $1
        ORDER BY study_date
      ),
      date_series AS (
        SELECT 
          study_date,
          study_date - INTERVAL '1 day' * ROW_NUMBER() OVER (ORDER BY study_date) as group_date
        FROM daily_activity
      ),
      streak_groups AS (
        SELECT group_date, COUNT(*) as streak_length
        FROM date_series
        GROUP BY group_date
      )
      SELECT MAX(streak_length) as longest_streak
      FROM streak_groups
    `, [id]);

    const longestStreak = longestStreakResult[0]?.longest_streak || 0;

    // Create calendar data for the last 30 days
    const calendarData = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const hasStudy = studyHistoryResult.some(record => 
        record.study_date === dateStr
      );
      
      calendarData.push({
        date: dateStr,
        hasStudy,
        isToday: i === 0
      });
    }

    return Response.json({
      currentStreak,
      longestStreak,
      calendarData,
      totalStudyDays: studyHistoryResult.length
    });
  } catch (error) {
    console.error('Error fetching streak data:', error);
    return Response.json(
      { error: 'Failed to fetch streak data' },
      { status: 500 }
    );
  }
}
