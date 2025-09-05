import { useState } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import { resetUserProgress, generateNewUserProgress, applyUserProgress } from '../../utils/progressManager';

export function ResetProgressModal({ isOpen, onClose, onReset }) {
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleReset = async () => {
    if (confirmText !== 'RESET') {
      alert('「RESET」と入力してください');
      return;
    }

    setLoading(true);
    
    try {
      // 現在のユーザーIDを取得
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userId = currentUser.id;
      
      if (userId) {
        // ユーザーごとの進捗をリセット
        resetUserProgress(userId);
        
        // 新しい進捗を生成して適用
        const newProgress = generateNewUserProgress();
        applyUserProgress(userId);
        
        console.log('Progress reset completed for user:', userId);
        alert('学習進捗がリセットされました！');
        onReset();
        onClose();
      } else {
        alert('ユーザー情報が見つかりません');
      }
    } catch (error) {
      console.error('Reset error:', error);
      alert('リセット中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <RotateCcw className="w-6 h-6 mr-2 text-orange-500" />
              学習進捗リセット
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* 警告メッセージ */}
          <div className="mb-6 p-4 bg-orange-100 border border-orange-400 text-orange-700 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">⚠️ 注意</h3>
                <p className="text-sm">
                  この操作により以下のデータが削除されます：
                </p>
                <ul className="text-sm mt-2 ml-4 list-disc">
                  <li>問題の解答履歴</li>
                  <li>学習進捗（完了・部分完了・学習中）</li>
                  <li>お気に入り問題</li>
                  <li>間違い問題リスト</li>
                  <li>学習統計（正解率・ストリーク等）</li>
                </ul>
                <p className="text-sm mt-2 font-semibold">
                  この操作は取り消すことができません。
                </p>
              </div>
            </div>
          </div>

          {/* 確認入力 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              確認のため「<span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">RESET</span>」と入力してください：
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="RESET"
            />
          </div>

          {/* ボタン */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
            >
              キャンセル
            </button>
            <button
              onClick={handleReset}
              disabled={loading || confirmText !== 'RESET'}
              className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'リセット中...' : '進捗をリセット'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
