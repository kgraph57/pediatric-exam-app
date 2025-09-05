import sql from '@/app/api/utils/sql';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    const month = parseInt(searchParams.get('month')) || new Date().getMonth() + 1;

    if (!id) {
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // 指定された月の開始日と終了日を計算
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    // 学習履歴を取得
    const learningHistoryResult = await sql(`
      SELECT 
        DATE(answered_at) as study_date,
        COUNT(*) as questions_answered,
        COUNT(CASE WHEN is_correct THEN 1 END) as correct_answers,
        AVG(time_spent) as avg_time_spent,
        STRING_AGG(DISTINCT q.category, ', ') as categories
      FROM study_history sh
      JOIN questions q ON sh.question_id = q.id
      WHERE sh.user_id = $1 
        AND DATE(answered_at) >= $2 
        AND DATE(answered_at) <= $3
      GROUP BY DATE(answered_at)
      ORDER BY study_date
    `, [id, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]);

    // 月のカレンダーデータを作成
    const calendarData = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();

    // 前月の日付を追加（カレンダーの最初の週を埋める）
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month - 1, -i);
      calendarData.push({
        date: prevDate.toISOString().split('T')[0],
        day: prevDate.getDate(),
        isCurrentMonth: false,
        hasStudy: false,
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
        avgTimeSpent: 0,
        categories: []
      });
    }

    // 今月の日付を追加
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // 学習履歴から該当する日付のデータを取得
      const dayHistory = learningHistoryResult.find(h => h.study_date === dateStr);
      
      calendarData.push({
        date: dateStr,
        day: day,
        isCurrentMonth: true,
        hasStudy: !!dayHistory,
        questionsAnswered: dayHistory?.questions_answered || 0,
        correctAnswers: dayHistory?.correct_answers || 0,
        accuracy: dayHistory ? Math.round((dayHistory.correct_answers / dayHistory.questions_answered) * 100) : 0,
        avgTimeSpent: dayHistory?.avg_time_spent || 0,
        categories: dayHistory?.categories ? dayHistory.categories.split(', ') : []
      });
    }

    // 来月の日付を追加（カレンダーの最後の週を埋める）
    const lastDayOfWeek = lastDay.getDay();
    const remainingDays = 6 - lastDayOfWeek;
    for (let i = 1; i <= remainingDays; i++) {
      const nextDate = new Date(year, month, i);
      calendarData.push({
        date: nextDate.toISOString().split('T')[0],
        day: nextDate.getDate(),
        isCurrentMonth: false,
        hasStudy: false,
        questionsAnswered: 0,
        correctAnswers: 0,
        accuracy: 0,
        avgTimeSpent: 0,
        categories: []
      });
    }

    // 月の統計を計算
    const monthStats = {
      totalDays: learningHistoryResult.length,
      totalQuestions: learningHistoryResult.reduce((sum, day) => sum + day.questions_answered, 0),
      totalCorrect: learningHistoryResult.reduce((sum, day) => sum + day.correct_answers, 0),
      overallAccuracy: learningHistoryResult.length > 0 
        ? Math.round(learningHistoryResult.reduce((sum, day) => sum + day.correct_answers, 0) / 
                     learningHistoryResult.reduce((sum, day) => sum + day.questions_answered, 0) * 100)
        : 0,
      avgQuestionsPerDay: learningHistoryResult.length > 0 
        ? Math.round(learningHistoryResult.reduce((sum, day) => sum + day.questions_answered, 0) / learningHistoryResult.length)
        : 0
    };

    return Response.json({
      year,
      month,
      calendarData,
      monthStats,
      learningHistory: learningHistoryResult
    });

  } catch (error) {
    console.error('Error fetching learning calendar:', error);
    return Response.json(
      { error: 'Failed to fetch learning calendar' },
      { status: 500 }
    );
  }
}
