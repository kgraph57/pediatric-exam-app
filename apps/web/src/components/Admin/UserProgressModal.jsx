import { useState, useEffect } from 'react';
import { X, RotateCcw, BarChart3, Target, Clock, TrendingUp } from 'lucide-react';

export function UserProgressModal({ user, isOpen, onClose }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchUserProgress();
    }
  }, [user, isOpen]);

  const fetchUserProgress = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id}/progress`);
      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      } else {
        console.error('Failed to fetch user progress');
      }
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetProgress = async () => {
    if (confirm('このユーザーの学習進捗をリセットしますか？この操作は取り消せません。')) {
      try {
        setResetting(true);
        const response = await fetch(`/api/users/${user.id}/progress`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('ユーザーの進捗がリセットされました');
          fetchUserProgress(); // 進捗を再取得
        } else {
          const data = await response.json();
          alert(data.message || '進捗のリセットに失敗しました');
        }
      } catch (error) {
        console.error('Error resetting progress:', error);
        alert('進捗のリセットに失敗しました');
      } finally {
        setResetting(false);
      }
    }
  };

  if (!isOpen || !user) return null;

  // 進捗統計を計算
  const calculateStats = () => {
    if (!progress) return null;

    const studyProgress = progress.studyProgress || {};
    let totalAnswered = 0;
    let totalCorrect = 0;
    const categoryStats = {};

    Object.entries(studyProgress).forEach(([category, questions]) => {
      let categoryAnswered = 0;
      let categoryCorrect = 0;

      Object.values(questions).forEach(q => {
        totalAnswered++;
        categoryAnswered++;
        if (q.isCorrect) {
          totalCorrect++;
          categoryCorrect++;
        }
      });

      categoryStats[category] = {
        answered: categoryAnswered,
        correct: categoryCorrect,
        accuracy: categoryAnswered > 0 ? Math.round((categoryCorrect / categoryAnswered) * 100) : 0
      };
    });

    return {
      totalAnswered,
      totalCorrect,
      accuracy: totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0,
      categoryStats
    };
  };

  const stats = calculateStats();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user.name} の学習進捗
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 全体統計 */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                全体統計
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats?.totalAnswered || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    総回答数
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats?.totalCorrect || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    正解数
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats?.accuracy || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    正解率
                  </div>
                </div>
              </div>
            </div>

            {/* カテゴリ別進捗 */}
            <div>
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
                カテゴリ別進捗
              </h4>
              <div className="space-y-3">
                {stats?.categoryStats && Object.keys(stats.categoryStats).length > 0 ? (
                  Object.entries(stats.categoryStats).map(([category, categoryStat]) => (
                    <div key={category} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {category}
                        </h5>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {categoryStat.accuracy}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>回答: {categoryStat.answered}問</span>
                        <span>正解: {categoryStat.correct}問</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${categoryStat.accuracy}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    まだ学習進捗がありません
                  </div>
                )}
              </div>
            </div>

            {/* お気に入り・間違い問題 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-500" />
                  お気に入り問題
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {progress?.favoriteIds?.length || 0}問
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  間違い問題
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {progress?.incorrectIds?.length || 0}問
                </div>
              </div>
            </div>

            {/* 最終ログイン */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                最終ログイン
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {progress?.lastLogin ? new Date(progress.lastLogin).toLocaleString('ja-JP') : '不明'}
              </div>
            </div>
          </div>
        )}

        {/* ボタン */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleResetProgress}
            disabled={resetting || !stats?.totalAnswered}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {resetting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            {resetting ? 'リセット中...' : '進捗をリセット'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
