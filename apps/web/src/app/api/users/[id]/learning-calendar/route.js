import { neon } from '@neondatabase/serverless';

export async function GET(request, { params }) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear());
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1));

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      return Response.json(generateMockCalendarData(year, month));
    }

    const sql = neon(process.env.DATABASE_URL);

    // 指定された月の学習データを取得
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const studyData = await sql`
      SELECT 
        DATE(answered_at) as study_date,
        COUNT(*) as questions_answered
      FROM study_history 
      WHERE user_id = ${userId} 
        AND answered_at >= ${startDate.toISOString()}
        AND answered_at <= ${endDate.toISOString()}
      GROUP BY DATE(answered_at)
      ORDER BY study_date
    `;

    // カレンダーデータを生成
    const calendarData = generateCalendarData(year, month, studyData);

    // 月統計を計算
    const monthStats = await sql`
      SELECT 
        COUNT(*) as total_questions,
        SUM(CASE WHEN is_correct THEN 1 ELSE 0 END) as correct_answers,
        COUNT(DISTINCT DATE(answered_at)) as study_days
      FROM study_history 
      WHERE user_id = ${userId} 
        AND answered_at >= ${startDate.toISOString()}
        AND answered_at <= ${endDate.toISOString()}
    `;

    return Response.json({
      calendarData,
      monthStats: {
        totalQuestions: parseInt(monthStats[0]?.total_questions || 0),
        correctAnswers: parseInt(monthStats[0]?.correct_answers || 0),
        studyDays: parseInt(monthStats[0]?.study_days || 0)
      }
    });

  } catch (error) {
    console.error('Error fetching learning calendar:', error);
    return Response.json(
      { error: '学習カレンダーの取得に失敗しました' },
      { status: 500 }
    );
  }
}

function generateCalendarData(year, month, studyData) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const calendarDays = [];
  
  // 前月の日付を追加
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevMonthDate = new Date(year, month - 1, -startingDayOfWeek + i + 1);
    calendarDays.push({
      day: prevMonthDate.getDate(),
      date: prevMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      hasStudy: false,
      questionsAnswered: 0
    });
  }
  
  // 今月の日付を追加
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const dateString = date.toISOString().split('T')[0];
    const studyRecord = studyData.find(record => record.study_date === dateString);
    
    calendarDays.push({
      day,
      date: dateString,
      isCurrentMonth: true,
      hasStudy: !!studyRecord,
      questionsAnswered: studyRecord ? parseInt(studyRecord.questions_answered) : 0
    });
  }
  
  // 来月の日付を追加
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDate = new Date(year, month, i);
    calendarDays.push({
      day: nextMonthDate.getDate(),
      date: nextMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      hasStudy: false,
      questionsAnswered: 0
    });
  }
  
  return calendarDays;
}

function generateMockCalendarData(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const calendarDays = [];
  
  // 前月の日付を追加
  for (let i = 0; i < startingDayOfWeek; i++) {
    const prevMonthDate = new Date(year, month - 1, -startingDayOfWeek + i + 1);
    calendarDays.push({
      day: prevMonthDate.getDate(),
      date: prevMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      hasStudy: false,
      questionsAnswered: 0
    });
  }
  
  // 今月の日付を追加
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const isToday = new Date().toDateString() === date.toDateString();
    const isPast = date < new Date();
    
    // 過去の日付にはランダムな学習データを生成
    let hasStudied = false;
    let questionsAnswered = 0;
    
    if (isPast && !isToday) {
      hasStudied = Math.random() > 0.3; // 70%の確率で学習
      if (hasStudied) {
        questionsAnswered = Math.floor(Math.random() * 10) + 1;
      }
    }
    
    calendarDays.push({
      day,
      date: date.toISOString().split('T')[0],
      isCurrentMonth: true,
      hasStudy: hasStudied,
      questionsAnswered
    });
  }
  
  // 来月の日付を追加
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    const nextMonthDate = new Date(year, month, i);
    calendarDays.push({
      day: nextMonthDate.getDate(),
      date: nextMonthDate.toISOString().split('T')[0],
      isCurrentMonth: false,
      hasStudy: false,
      questionsAnswered: 0
    });
  }
  
  return {
    calendarData: calendarDays,
    monthStats: {
      totalQuestions: 25,
      correctAnswers: 20,
      studyDays: 15
    }
  };
}
