import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Brain, Calendar, Target, TrendingUp, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import { DailyMission } from './DailyMission';
import { LearningCalendar } from './LearningCalendar';
import { 
  getUserLearningSessions, 
  calculateLearningStats, 
  calculateCategoryStats 
} from '../../utils/learningHistory';
import { demoQuestions } from '../../data/demoQuestions';

// 学習履歴統計コンポーネント
function LearningHistoryStats({ userId }) {
  const [stats, setStats] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (userId) {
      const learningStats = calculateLearningStats(userId);
      const learningSessions = getUserLearningSessions(userId);
      setStats(learningStats);
      setSessions(learningSessions.slice(0, 5)); // 最新5セッション
    }
  }, [userId]);

  if (!stats) return <div className="text-gray-500">読み込み中...</div>;

  return (
    <div className="space-y-4">
      {/* 統計サマリー */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">正解数</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {stats.totalCorrect}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <XCircle className="w-5 h-5 text-red-500" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">不正解数</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {stats.totalIncorrect}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Target className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">正解率</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {stats.accuracy}%
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Clock className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">学習時間</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {Math.round(stats.totalStudyTime / 60)}分
            </p>
          </div>
        </div>
      </div>

      {/* 最近のセッション */}
      {sessions.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            最近の学習セッション
          </h3>
          <div className="space-y-2">
            {sessions.map((session, index) => (
              <div key={session.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <div>
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {session.category || '全カテゴリ'} - {session.difficulty || '全難易度'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(session.timestamp).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {session.correctAnswers}/{session.totalQuestions}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {Math.round(session.timeSpent / 60)}分
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardSection({ user, onSectionChange }) {
  const [greeting, setGreeting] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);

  // Get user statistics
  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      try {
        const response = await fetch(`/api/users/${user.id}/stats`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.log('API取得に失敗、ローカルストレージから取得:', error);
      }
      
      // フォールバック: 直接学習履歴から統計を計算
      const learningSessions = JSON.parse(localStorage.getItem('learningSessions') || '{}');
      const userSessions = learningSessions[user.id] || [];
      
      console.log('🔍 Dashboard: Direct stats calculation:', {
        userId: user.id,
        userSessionsLength: userSessions.length,
        userSessions: userSessions.map(s => ({ 
          id: s.id, 
          totalQuestions: s.totalQuestions,
          correctAnswers: s.correctAnswers,
          timeSpent: s.timeSpent,
          timestamp: s.timestamp
        }))
      });
      
      // 学習履歴から統計を計算
      const totalQuestionsAnswered = userSessions.reduce((sum, session) => sum + (session.totalQuestions || 0), 0);
      const totalCorrectAnswers = userSessions.reduce((sum, session) => sum + (session.correctAnswers || 0), 0);
      const accuracy = totalQuestionsAnswered > 0 ? Math.round((totalCorrectAnswers / totalQuestionsAnswered) * 100) : 0;
      const totalStudyTime = userSessions.reduce((sum, session) => sum + (session.timeSpent || 0), 0);
      
      // 連続学習日数を計算
      const studyDays = new Set();
      userSessions.forEach(session => {
        const date = new Date(session.timestamp).toDateString();
        studyDays.add(date);
      });
      
      console.log('📊 Dashboard stats:', {
        totalQuestionsAnswered,
        totalCorrectAnswers,
        accuracy,
        totalStudyTime,
        studyDays: studyDays.size
      });
      
      return {
        totalQuestionsAnswered,
        correctAnswers: totalCorrectAnswers,
        accuracy,
        streak: studyDays.size,
        totalStudyTime,
        studyDays: studyDays.size
      };
    },
    enabled: !!user?.id,
  });

  // Get actual question statistics
  const { data: questionStats } = useQuery({
    queryKey: ['questionStats'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/questions/stats');
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.log('API取得に失敗、デモデータを使用:', error);
      }
      
      // フォールバック: デモデータ
      return {
        totalQuestions: 500,
        categories: {
          '一般小児科': 150,
          '新生児・周産期': 120,
          '呼吸器': 100,
          '循環器': 80,
          '消化器': 90,
          '神経': 70,
          '内分泌': 60,
          '血液・腫瘍': 50,
          '免疫・アレルギー': 40,
          '感染症': 110,
          '救急・蘇生': 80,
          '発達・行動': 30
        }
      };
    },
  });

  // Get recent activity
  const { data: recentActivity } = useQuery({
    queryKey: ['recentActivity', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        const response = await fetch(`/api/users/${user.id}/recent-activity`);
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.log('API取得に失敗、空の配列を返す:', error);
      }
      
      // フォールバック: 空の配列（新規ユーザーは活動なし）
      return [];
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('おはようございます');
    else if (hour < 18) setGreeting('こんにちは');
    else setGreeting('こんばんは');
  }, []);

  // 進捗更新イベントをリッスン
  useEffect(() => {
    const handleProgressUpdate = () => {
      // 統計データを再取得
      if (user?.id) {
        // QueryClientのinvalidateQueriesを使用してデータを再取得
        window.dispatchEvent(new CustomEvent('refreshStats'));
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('progressUpdated', handleProgressUpdate);
      return () => {
        window.removeEventListener('progressUpdated', handleProgressUpdate);
      };
    }
  }, [user?.id]);

  const initializeDatabase = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch('/api/init-db', { method: 'POST' });
      if (response.ok) {
        console.log('Database initialized successfully');
        // Refresh the page to see the new features
        window.location.reload();
      } else {
        console.error('Failed to initialize database');
      }
    } catch (error) {
      console.error('Database initialization error:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const statCards = [
    {
      title: '学習日数',
      value: stats?.studyDays || 0,
      subtitle: '日連続',
      icon: Calendar,
      color: 'text-[#34C759]',
      bgColor: 'bg-[#34C759]/10',
    },
    {
      title: '総問題数',
      value: questionStats?.totalQuestions || stats?.totalAnswered || 0,
      subtitle: '問題',
      icon: BookOpen,
      color: 'text-[#007AFF]',
      bgColor: 'bg-[#007AFF]/10',
    },
    {
      title: '正解率',
      value: stats?.accuracy || 0,
      subtitle: '%',
      icon: Target,
      color: 'text-[#FF9500]',
      bgColor: 'bg-[#FF9500]/10',
    },
    {
      title: 'ストリーク',
      value: stats?.streak || 0,
      subtitle: '日',
      icon: Zap,
      color: 'text-[#FF3B30]',
      bgColor: 'bg-[#FF3B30]/10',
    },
  ];



  // Generate categories from actual user progress
  const categories = (() => {
    if (!user?.id) return [];
    
    // ユーザーの実際の進捗を取得
    const localProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    const userProgress = localProgress[user.id] || {};
    const categoryStats = userProgress.categoryStats || {};
    
    // カテゴリ別の実際の進捗を計算
    const categoryProgress = Object.entries(questionStats?.categoryStats || {})
      .filter(([_, data]) => data.count > 0)
      .slice(0, 5) // 上位5カテゴリを表示
      .map(([key, data]) => {
        const userCategoryStats = categoryStats[key] || { answered: 0, correct: 0 };
        const completed = userCategoryStats.answered || 0;
        const total = data.count;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        return {
          name: data.name,
          progress: progress,
          total: total,
          completed: completed
        };
      });
    
    return categoryProgress;
  })();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Greeting and Summary */}
      <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {greeting}、{user?.name}さん！
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              今日も小児科専門医試験の準備を頑張りましょう。
            </p>
          </div>
        </div>
      </div>

      {/* Daily Mission - 一番上に配置 */}
      <div className="mb-6">
        <DailyMission userId={user?.id} onStartPractice={() => onSectionChange('practice')} />
      </div>





        {/* Learning Calendar and Category Progress - Side by Side */}
        <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Calendar - Left Side */}
          <div className="min-h-[500px]">
            <LearningCalendar userId={user?.id} />
          </div>

          {/* Category Progress - Right Side */}
          <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700 min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                カテゴリ別進捗
              </h2>
              <TrendingUp className="text-[#007AFF]" size={20} />
            </div>
            <div className="grid grid-cols-1 gap-4 flex-1 justify-items-stretch">
              {categories.map((category, index) => (
                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {category.completed}/{category.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        category.progress >= 100 
                          ? 'bg-gradient-to-r from-[#34C759] to-[#28A745]' 
                          : category.progress >= 80 
                            ? 'bg-gradient-to-r from-[#FF9500] to-[#FF6B35]'
                            : 'bg-gradient-to-r from-[#007AFF] to-[#0056CC]'
                      }`}
                      style={{ width: `${category.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {category.progress}% 完了
                    </span>
                    {category.progress < 100 && (
                      <span className="text-xs text-[#007AFF] font-medium">
                        あと{category.total - category.completed}問
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* AI Learning Coach Recommendation */}
      <div className="mb-6 bg-gradient-to-r from-[#34C759]/10 to-[#28A745]/10 border border-[#34C759]/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#34C759]/20 rounded-lg">
            <Brain className="text-[#34C759]" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              AI学習コーチからの提案
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              あなたの学習パターンを分析した結果です
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-[#262626] rounded-lg p-4 border border-[#34C759]/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              今日のおすすめ
            </span>
            <span className="text-xs text-[#34C759] font-medium">AI推奨</span>
          </div>
          
          <div className="space-y-2">
            {categories
              .filter(cat => cat.progress < 80)
              .sort((a, b) => b.progress - a.progress)
              .slice(0, 2)
              .map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {category.name}を{Math.min(5, Math.ceil((100 - category.progress) / 10))}問解こう
                  </span>
                  <button
                    onClick={() => onSectionChange('practice')}
                    className="px-3 py-1 text-xs bg-[#34C759] text-white rounded hover:bg-[#28A745] transition-colors"
                  >
                    挑戦する
                  </button>
                </div>
              ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
              💡 弱点分野を重点的に学習することで、効率的にスキルアップできます
            </p>
          </div>
        </div>
      </div>

      {/* Learning History */}
      {user?.id && (
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            学習履歴
          </h2>
          <LearningHistoryStats userId={user.id} />
        </div>
      )}

      {/* Recent activity */}
      {recentActivity && recentActivity.length > 0 && (
        <div className="bg-white dark:bg-[#262626] rounded-xl p-6 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            最近の活動
          </h2>
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.isCorrect ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`}></div>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {activity.category} - {activity.difficulty}
                  </span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.timeAgo}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}