import { useQuery } from '@tanstack/react-query';
import { BarChart3, Calendar, Target, TrendingUp, Trophy, Clock, BookOpen } from 'lucide-react';

export function ProgressSection({ user }) {
  // Get detailed progress data
  const { data: progressData, isLoading } = useQuery({
    queryKey: ['progressData', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}/progress`);
      if (!response.ok) throw new Error('Failed to fetch progress data');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Get weekly statistics
  const { data: weeklyStats } = useQuery({
    queryKey: ['weeklyStats', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}/weekly-stats`);
      if (!response.ok) throw new Error('Failed to fetch weekly stats');
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Get actual question statistics
  const { data: questionStats } = useQuery({
    queryKey: ['questionStats'],
    queryFn: async () => {
      const response = await fetch('/api/questions/stats');
      if (!response.ok) throw new Error('Failed to fetch question stats');
      return response.json();
    },
  });

  // Generate category data from actual user progress
  const categoryData = (() => {
    if (!user?.id) return [];
    
    // ユーザーの実際の進捗を取得
    const localProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    const userProgress = localProgress[user.id] || {};
    const categoryStats = userProgress.categoryStats || {};
    
    const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#AF52DE'];
    
    // カテゴリ別の実際の進捗を計算
    const categoryProgress = Object.entries(questionStats?.categoryStats || {})
      .filter(([_, data]) => data.count > 0)
      .map(([key, data], index) => {
        const userCategoryStats = categoryStats[key] || { answered: 0, correct: 0 };
        const answered = userCategoryStats.answered || 0;
        const correct = userCategoryStats.correct || 0;
        const total = data.count;
        const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
        
        return {
          name: data.name,
          accuracy: accuracy,
          total: total,
          correct: correct,
          color: colors[index % colors.length]
        };
      });
    
    return categoryProgress;
  })();

  // 週間データを実際のユーザー進捗から生成
  const weeklyData = (() => {
    if (!user?.id) return [
      { day: '月', questions: 0, accuracy: 0 },
      { day: '火', questions: 0, accuracy: 0 },
      { day: '水', questions: 0, accuracy: 0 },
      { day: '木', questions: 0, accuracy: 0 },
      { day: '金', questions: 0, accuracy: 0 },
      { day: '土', questions: 0, accuracy: 0 },
      { day: '日', questions: 0, accuracy: 0 },
    ];
    
    // 学習履歴から週間データを計算
    const learningSessions = JSON.parse(localStorage.getItem('learningSessions') || '{}');
    const userSessions = learningSessions[user.id] || [];
    
    const days = ['日', '月', '火', '水', '木', '金', '土'];
    const weeklyStats = days.map(day => {
      const daySessions = userSessions.filter(session => {
        const sessionDate = new Date(session.timestamp);
        const sessionDay = days[sessionDate.getDay()];
        return sessionDay === day;
      });
      
      const totalQuestions = daySessions.reduce((sum, session) => sum + (session.totalQuestions || 0), 0);
      const totalCorrect = daySessions.reduce((sum, session) => sum + (session.correctAnswers || 0), 0);
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      
      return {
        day,
        questions: totalQuestions,
        accuracy
      };
    });
    
    return weeklyStats;
  })();

  // 時間データを実際のユーザー進捗から生成
  const timeData = (() => {
    if (!user?.id) return [
      { hour: '6-9', count: 0, accuracy: 0 },
      { hour: '9-12', count: 0, accuracy: 0 },
      { hour: '12-15', count: 0, accuracy: 0 },
      { hour: '15-18', count: 0, accuracy: 0 },
      { hour: '18-21', count: 0, accuracy: 0 },
      { hour: '21-24', count: 0, accuracy: 0 },
    ];
    
    // 学習履歴から時間データを計算
    const learningSessions = JSON.parse(localStorage.getItem('learningSessions') || '{}');
    const userSessions = learningSessions[user.id] || [];
    
    const timeSlots = [
      { hour: '6-9', start: 6, end: 9 },
      { hour: '9-12', start: 9, end: 12 },
      { hour: '12-15', start: 12, end: 15 },
      { hour: '15-18', start: 15, end: 18 },
      { hour: '18-21', start: 18, end: 21 },
      { hour: '21-24', start: 21, end: 24 },
    ];
    
    const timeStats = timeSlots.map(slot => {
      const slotSessions = userSessions.filter(session => {
        const sessionDate = new Date(session.timestamp);
        const sessionHour = sessionDate.getHours();
        return sessionHour >= slot.start && sessionHour < slot.end;
      });
      
      const totalQuestions = slotSessions.reduce((sum, session) => sum + (session.totalQuestions || 0), 0);
      const totalCorrect = slotSessions.reduce((sum, session) => sum + (session.correctAnswers || 0), 0);
      const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
      
      return {
        hour: slot.hour,
        count: totalQuestions,
        accuracy
      };
    });
    
    return timeStats;
  })();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            進捗分析
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            学習の進捗と傾向を詳しく分析
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="text-[#007AFF]" size={24} />
        </div>
      </div>

            {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#007AFF]/10 rounded-lg">
              <Target className="text-[#007AFF]" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {questionStats?.totalQuestions ? 
                Math.round((categoryData.reduce((sum, cat) => sum + cat.correct, 0) / questionStats.totalQuestions) * 100) : 78}%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            総合正解率
          </p>
        </div>

        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#34C759]/10 rounded-lg">
              <BookOpen className="text-[#34C759]" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {questionStats?.totalQuestions || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            総問題数
          </p>
        </div>

        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#34C759]/10 rounded-lg">
              <Trophy className="text-[#34C759]" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              7
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            連続学習日数
          </p>
        </div>

        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#FF9500]/10 rounded-lg">
              <Clock className="text-[#FF9500]" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              45
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            平均回答時間（秒）
          </p>
        </div>

        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#FF3B30]/10 rounded-lg">
              <TrendingUp className="text-[#FF3B30]" size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              +12%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            先週比改善率
          </p>
        </div>
      </div>

      {/* Category performance */}
      <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
          カテゴリ別成績
        </h2>
        <div className="space-y-4">
          {categoryData.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {category.correct}/{category.total}
                  </span>
                  <span className={`text-sm font-medium ${
                    category.accuracy >= 80 ? 'text-[#34C759]' :
                    category.accuracy >= 60 ? 'text-[#FF9500]' : 'text-[#FF3B30]'
                  }`}>
                    {category.accuracy}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${category.accuracy}%`,
                    backgroundColor: category.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly trend and time analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly trend */}
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            週間学習傾向
          </h3>
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">
                  {day.day}
                </span>
                <div className="flex-1 mx-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-[#007AFF] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.questions / 30) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
                      {day.questions}問
                    </span>
                  </div>
                </div>
                <span className={`text-sm font-medium w-12 text-right ${
                  day.accuracy >= 80 ? 'text-[#34C759]' :
                  day.accuracy >= 60 ? 'text-[#FF9500]' : 'text-[#FF3B30]'
                }`}>
                  {day.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Time pattern analysis */}
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            時間帯別学習パターン
          </h3>
          <div className="space-y-4">
            {timeData.map((time, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {time.hour}時
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {time.count}問
                    </span>
                    <span className={`text-sm font-medium ${
                      time.accuracy >= 80 ? 'text-[#34C759]' :
                      time.accuracy >= 60 ? 'text-[#FF9500]' : 'text-[#FF3B30]'
                    }`}>
                      {time.accuracy}%
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-[#007AFF] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(time.count / 25) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        time.accuracy >= 80 ? 'bg-[#34C759]' :
                        time.accuracy >= 60 ? 'bg-[#FF9500]' : 'bg-[#FF3B30]'
                      }`}
                      style={{ width: `${time.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          学習推奨事項
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-[#FF9500]/10 rounded-lg">
            <div className="w-2 h-2 bg-[#FF9500] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                内分泌分野の強化が必要
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                正解率55%と低めです。基本問題から復習することをお勧めします。
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-[#34C759]/10 rounded-lg">
            <div className="w-2 h-2 bg-[#34C759] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                夕方の学習が効果的
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                18-21時の正解率が88%と高いです。この時間帯の学習を継続しましょう。
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-[#007AFF]/10 rounded-lg">
            <div className="w-2 h-2 bg-[#007AFF] rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                学習継続が順調
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                7日連続学習を達成しています。この調子で継続しましょう。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}