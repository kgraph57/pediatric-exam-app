import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Users } from 'lucide-react';
import { applyUserProgress, generateDemoProgress, generateNewUserProgress, saveUserProgress } from '../../utils/progressManager';
import { demoUsers } from '../../data/demoUsers';

export function LoginModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // デモユーザーのログイン
      if (formData.email === 'demo@example.com' && formData.password === 'demo123') {
        const demoUser = {
          id: 'demo',
          name: 'デモユーザー',
          email: 'demo@example.com',
          hospital: '東京小児科病院',
          department: '小児科',
          experienceYears: '5',
          targetLevel: 7,
          specialty: '循環器',
          studyGoal: '小児科専門医取得',
          dailyGoal: 15,
          weeklyGoal: 80,
          level: 1,
          total_answered: 0,
          total_correct: 0,
          streak: 0,
          createdAt: new Date().toISOString()
        };

        // ログイン成功時、ユーザー情報をローカルストレージに保存
        localStorage.setItem('currentUser', JSON.stringify(demoUser));
        
        // デモユーザーの学習進捗を生成
        const userId = demoUser.id;
        let userProgress = applyUserProgress(userId);
        
        if (!userProgress || Object.keys(userProgress.studyProgress).length === 0) {
          userProgress = generateDemoProgress(userId);
          saveUserProgress(userId, userProgress);
          applyUserProgress(userId);
        }
        
        // 成功メッセージを表示
        alert('ログインが完了しました！');
        onSuccess();
        onClose();
        return;
      }

      // 登録済みユーザーのログイン
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        // ログイン成功時、ユーザー情報をローカルストレージに保存
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // ユーザーの学習進捗を適用
        const userId = user.id;
        let userProgress = applyUserProgress(userId);
        
        // 新規ユーザーで進捗がない場合は初期化
        if (!userProgress || Object.keys(userProgress.studyProgress).length === 0) {
          userProgress = generateNewUserProgress();
          saveUserProgress(userId, userProgress);
          applyUserProgress(userId);
        }
        
        // 成功メッセージを表示
        alert('ログインが完了しました！');
        onSuccess();
        onClose();
        return;
      }

      // APIログインを試行（フォールバック）
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const responseData = await response.json();

        if (response.ok) {
          // ログイン成功時、ユーザー情報をローカルストレージに保存
          localStorage.setItem('currentUser', JSON.stringify(responseData.user));
          
          // ユーザーの学習進捗を適用
          const userId = responseData.user.id;
          let userProgress = applyUserProgress(userId);
          
          // デモユーザーの場合は進捗を生成
          if (userId === 'demo') {
            userProgress = generateDemoProgress(userId);
            saveUserProgress(userId, userProgress);
            applyUserProgress(userId);
          }
          // 新規ユーザーで進捗がない場合は初期化
          else if (!userProgress || Object.keys(userProgress.studyProgress).length === 0) {
            userProgress = generateNewUserProgress();
            saveUserProgress(userId, userProgress);
            applyUserProgress(userId);
          }
          
          // 成功メッセージを表示
          alert('ログインが完了しました！');
          onSuccess();
          onClose();
          return;
        } else {
          setError(responseData.message || 'ログインに失敗しました');
        }
      } catch (apiError) {
        console.log('APIログインに失敗、ローカル認証を試行:', apiError);
        setError('メールアドレスまたはパスワードが正しくありません');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('ネットワークエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              ログイン
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* テストユーザー情報 */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center mb-3">
              <Users className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">
                テストユーザーアカウント
              </h3>
            </div>
            <div className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
              <p className="font-medium">以下のアカウントでログインできます：</p>
              <div className="grid grid-cols-1 gap-1">
                {demoUsers.slice(0, 3).map((user, index) => (
                  <div key={user.id} className="flex justify-between">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-blue-600 dark:text-blue-400">{user.email}</span>
                  </div>
                ))}
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                パスワード: test123
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* メールアドレス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Mail className="inline w-4 h-4 mr-1" />
                メールアドレス
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="example@email.com"
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Lock className="inline w-4 h-4 mr-1" />
                パスワード
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="パスワードを入力"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>

          {/* デモユーザー情報 */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              デモユーザーでログイン
            </h3>
            <div className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
              <p>メール: demo@example.com</p>
              <p>パスワード: demo123</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  email: 'demo@example.com',
                  password: 'demo123'
                });
              }}
              className="mt-2 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-100 underline"
            >
              デモ情報を入力
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
