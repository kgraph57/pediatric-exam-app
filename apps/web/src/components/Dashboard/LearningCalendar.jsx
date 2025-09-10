import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, ChevronLeft, ChevronRight, BookOpen, Clock, Target } from 'lucide-react';

// 空のカレンダーデータ生成関数（新規ユーザー用）
function generateEmptyCalendarData(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const calendarDays = [];
  
  // 前月の日付を追加（カレンダーの最初の週を埋めるため）
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
  
  // 今月の日付を追加（すべて学習記録なし）
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const isToday = new Date().toDateString() === date.toDateString();
    
    calendarDays.push({
      day,
      date: date.toISOString().split('T')[0],
      isCurrentMonth: true,
      isToday,
      hasStudy: false, // 新規ユーザーは学習記録なし
      questionsAnswered: 0
    });
  }
  
  return {
    days: calendarDays,
    totalQuestions: 0,
    studyDays: 0,
    averageQuestions: 0
  };
}

// モックデータ生成関数
function generateMockCalendarData(year, month) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  const calendarDays = [];
  
  // 前月の日付を追加（カレンダーの最初の週を埋めるため）
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
  
  // 来月の日付を追加（カレンダーの最後の週を埋めるため）
  const remainingDays = 42 - calendarDays.length; // 6週間分の42日
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
  
  const monthStats = {
    totalDays: calendarDays.filter(day => day.isCurrentMonth && day.hasStudy).length,
    totalQuestions: calendarDays.filter(day => day.isCurrentMonth).reduce((sum, day) => sum + day.questionsAnswered, 0),
    overallAccuracy: 75, // 固定値
    avgQuestionsPerDay: Math.round(calendarDays.filter(day => day.isCurrentMonth && day.hasStudy).reduce((sum, day) => sum + day.questionsAnswered, 0) / Math.max(1, calendarDays.filter(day => day.isCurrentMonth && day.hasStudy).length))
  };
  
  return {
    days: calendarDays,
    totalQuestions: monthStats.totalQuestions,
    studyDays: monthStats.totalDays,
    averageQuestions: monthStats.avgQuestionsPerDay
  };
}

// 学習強度を判定する関数
function getStudyIntensity(questionsAnswered) {
  if (questionsAnswered === 0) return 'no-study';
  if (questionsAnswered <= 3) return 'light-study';
  if (questionsAnswered <= 7) return 'moderate-study';
  return 'intense-study';
}

// 月名を取得する関数
function getMonthName(month) {
  const monthNames = [
    '1月', '2月', '3月', '4月', '5月', '6月',
    '7月', '8月', '9月', '10月', '11月', '12月'
  ];
  return monthNames[month - 1];
}

export function LearningCalendar({ userId }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data: calendarData, isLoading } = useQuery({
    queryKey: ['learning-calendar', userId, year, month],
    queryFn: async () => {
      if (!userId) return generateMockCalendarData(year, month);
      
      try {
        const response = await fetch(`/api/users/${userId}/learning-calendar?year=${year}&month=${month}`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.log('API取得に失敗、空のカレンダーを表示:', error);
      }
      
      // フォールバック: 空のカレンダー（新規ユーザーは学習記録なし）
      return generateEmptyCalendarData(year, month);
    },
    enabled: !!userId,
  });

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const getMonthName = (month) => {
    const monthNames = [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    return monthNames[month - 1];
  };

  const getDayName = (day) => {
    const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
    return dayNames[day];
  };

  const getStudyIntensity = (questionsAnswered) => {
    if (questionsAnswered === 0) return 'no-study';
    if (questionsAnswered <= 3) return 'light-study';
    if (questionsAnswered <= 7) return 'moderate-study';
    return 'intense-study';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!calendarData) return null;

  const { calendarData: days, monthStats } = calendarData;

  return (
    <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">学習カレンダー</h2>
        <Calendar className="text-[#007AFF]" size={20} />
      </div>

      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="text-center">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {year}年{getMonthName(month)}
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {monthStats.totalDays}日間学習 • 平均{monthStats.avgQuestionsPerDay}問/日
          </p>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* カレンダー */}
      <div className="space-y-4">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 gap-2">
          {['日', '月', '火', '水', '木', '金', '土'].map((day) => (
            <div key={day} className="text-center">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* カレンダーグリッド */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                relative h-10 w-full rounded border transition-all duration-200 cursor-pointer
                ${day.isCurrentMonth 
                  ? 'border-gray-200 dark:border-gray-600' 
                  : 'border-gray-100 dark:border-gray-800'
                }
                ${day.hasStudy ? 'hover:scale-105' : ''}
              `}
              title={day.isCurrentMonth ? `${day.date}: ${day.questionsAnswered}問解答` : ''}
            >
              {/* 日付 */}
              <div className="absolute top-1 left-1">
                <span className={`
                  text-sm font-medium
                  ${day.isCurrentMonth 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-gray-400 dark:text-gray-600'
                  }
                `}>
                  {day.day}
                </span>
              </div>

              {/* 学習強度インジケーター */}
              {day.isCurrentMonth && day.hasStudy && (
                <div className={`
                  absolute inset-0 rounded opacity-80
                  ${getStudyIntensity(day.questionsAnswered) === 'light-study' && 'bg-blue-200 dark:bg-blue-800'}
                  ${getStudyIntensity(day.questionsAnswered) === 'moderate-study' && 'bg-blue-400 dark:bg-blue-600'}
                  ${getStudyIntensity(day.questionsAnswered) === 'intense-study' && 'bg-blue-600 dark:bg-blue-400'}
                `}></div>
              )}

              {/* 学習情報 */}
              {day.isCurrentMonth && day.hasStudy && (
                <div className="absolute bottom-1 right-1">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3 text-white" />
                    <span className="text-xs font-bold text-white">
                      {day.questionsAnswered}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 凡例 */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-blue-200 dark:bg-blue-800 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">軽度学習 (1-3問)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-600 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">中度学習 (4-7問)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 bg-blue-600 dark:bg-blue-400 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">集中学習 (8問以上)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 月間統計 */}
      <div className="mt-3 grid grid-cols-3 gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Target className="w-3 h-3 text-[#007AFF]" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {monthStats.totalQuestions}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">総問題数</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <BookOpen className="w-3 h-3 text-[#34C759]" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {monthStats.overallAccuracy}%
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">正答率</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-3 h-3 text-[#FF9500]" />
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {monthStats.totalDays}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">学習日数</p>
        </div>
      </div>
    </div>
  );
}
