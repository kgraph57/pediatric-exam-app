import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Target, Play, CheckCircle, Settings } from 'lucide-react';

// モックデータ生成関数
function generateMockDailyMission() {
  // Get actual question categories
  const { data: questionMeta } = useQuery({
    queryKey: ['questionMeta'],
    queryFn: async () => {
      const response = await fetch('/api/questions/meta');
      if (!response.ok) throw new Error('Failed to fetch question meta');
      return response.json();
    },
  });

  const categories = questionMeta?.categories || ['循環器', '呼吸器', '消化器', '内分泌・代謝', '神経', '免疫・アレルギー'];
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  const goal = Math.floor(Math.random() * 8) + 3; // 3-10問
  const progress = Math.floor(Math.random() * goal); // 0-goal問
  
  return {
    category: randomCategory,
    categoryName: randomCategory,
    goal,
    progress,
    status: progress >= goal ? 'completed' : 'in_progress',
    percentage: Math.round((progress / goal) * 100)
  };
}

export function DailyMission({ userId, onStartPractice }) {
  const queryClient = useQueryClient();
  const [showGoalSelector, setShowGoalSelector] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(5);

  // 問題数選択の変更を保存
  const handleGoalChange = async (newGoal) => {
    setSelectedGoal(newGoal);
    
    // 実際の実装では、APIを呼び出してユーザーの目標を更新
    try {
      // ここでユーザーの日次目標を更新するAPIを呼び出す
      console.log(`Setting daily goal to ${newGoal} questions`);
      
      // 成功メッセージを表示（オプション）
      // toast.success(`${newGoal}問に設定しました`);
    } catch (error) {
      console.error('Failed to update daily goal:', error);
    }
  };

  const { data: mission, isLoading } = useQuery({
    queryKey: ['dailyMission', userId],
    queryFn: async () => {
      try {
        const response = await fetch(`/api/users/${userId}/daily-mission`);
        if (!response.ok) throw new Error('Failed to fetch daily mission');
        return response.json();
      } catch (error) {
        console.log('Using mock data for daily mission');
        return generateMockDailyMission();
      }
    },
    enabled: !!userId,
  });

  // 初期化時にミッションの目標を設定
  useEffect(() => {
    if (mission && mission.goal) {
      setSelectedGoal(mission.goal);
    }
  }, [mission]);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#262626] rounded-xl p-4 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!mission) return null;

  const isCompleted = mission.progress >= selectedGoal;
  const progressPercentage = Math.round((mission.progress / selectedGoal) * 100);

  return (
    <div className="bg-white dark:bg-[#262626] rounded-xl p-4 shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          今日のミッション
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGoalSelector(!showGoalSelector)}
            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="目標問題数を変更"
          >
            <Settings size={16} />
          </button>
          <Target className="text-[#007AFF]" size={18} />
        </div>
      </div>

      {/* 問題数選択UI */}
      {showGoalSelector && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              1日の目標問題数を設定
            </h4>
            <button
              onClick={() => setShowGoalSelector(false)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
            >
              完了
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[5, 10, 15, 20, 25, 30].map((goal) => (
              <button
                key={goal}
                onClick={() => handleGoalChange(goal)}
                className={`p-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedGoal === goal
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-800/30 border border-gray-200 dark:border-gray-600'
                }`}
              >
                {goal}問
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            選択した問題数が今日の目標として設定されます
          </p>
        </div>
      )}

      {/* Mission content */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          {isCompleted ? (
            <CheckCircle className="text-[#34C759]" size={20} />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-[#007AFF] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#007AFF]"></div>
            </div>
          )}
          <div>
            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
              {mission.categoryName}を{selectedGoal}問解こう
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isCompleted ? 'ミッション完了！' : '今日の目標を達成しましょう'}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">進捗</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {mission.progress}/{selectedGoal}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                isCompleted 
                  ? 'bg-[#34C759]' 
                  : progressPercentage >= 80
                    ? 'bg-[#FF9500]'
                    : progressPercentage >= 50 
                      ? 'bg-[#FF9500]' 
                      : 'bg-[#FF9500]'
              }`}
              style={{ width: `${Math.min((mission.progress / selectedGoal) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="text-center">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round((mission.progress / selectedGoal) * 100)}%
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            if (onStartPractice) {
              onStartPractice();
            }
          }}
          disabled={isCompleted}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 shadow-md
            ${isCompleted
              ? 'bg-[#34C759] text-white cursor-default'
              : 'bg-[#007AFF] text-white hover:bg-[#0056CC] active:scale-95'
            }
          `}
        >
          {isCompleted ? (
            <>
              <CheckCircle size={16} />
              ミッション完了！
            </>
          ) : (
            <>
              <Play size={16} />
              ミッションを解く
            </>
          )}
        </button>
      </div>

      {/* Mission status */}
      {isCompleted && (
        <div className="mt-4 p-3 bg-[#34C759]/10 rounded-lg">
          <p className="text-sm text-[#34C759] text-center font-medium">
            🎉 おめでとうございます！今日のミッションを達成しました！
          </p>
        </div>
      )}
    </div>
  );
}
