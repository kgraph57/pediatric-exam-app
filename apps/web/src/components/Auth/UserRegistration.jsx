import { useState } from 'react';
import { User, Mail, Lock, Building, Calendar, Target } from 'lucide-react';
import { generateNewUserProgress, saveUserProgress, applyUserProgress } from '../../utils/progressManager';

export function UserRegistration({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    hospital: '',
    department: '',
    experienceYears: '',
    targetLevel: '',
    specialty: '',
    studyGoal: '',
    dailyGoal: 15,
    weeklyGoal: 80
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // 成功状態を設定
        setSuccess(true);
        setError('');
        
        // 登録されたユーザー情報をローカルストレージに保存
        localStorage.setItem('currentUser', JSON.stringify(responseData.user));
        
        // 新規ユーザーの学習進捗を初期化
        const userId = responseData.user.id;
        const newUserProgress = generateNewUserProgress();
        saveUserProgress(userId, newUserProgress);
        applyUserProgress(userId);
        
        // 登録されたユーザーを登録済みユーザーリストにも保存（ログイン用）
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push({
          ...responseData.user,
          password: formData.password // ログイン用にパスワードも保存
        });
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // 2秒後にモーダルを閉じる
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setError(responseData.message || '登録に失敗しました');
      }
    } catch (error) {
      console.error('Registration error:', error);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              新規ユーザー登録
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

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              ✅ ユーザー登録が完了しました！2秒後に自動的に閉じます。
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User className="inline w-4 h-4 mr-1" />
                  お名前 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail className="inline w-4 h-4 mr-1" />
                  メールアドレス *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* パスワード */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Lock className="inline w-4 h-4 mr-1" />
                  パスワード *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Lock className="inline w-4 h-4 mr-1" />
                  パスワード確認 *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* 医療機関情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Building className="inline w-4 h-4 mr-1" />
                  医療機関名
                </label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  診療科
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">選択してください</option>
                  <option value="小児科">小児科</option>
                  <option value="小児外科">小児外科</option>
                  <option value="新生児科">新生児科</option>
                  <option value="小児循環器科">小児循環器科</option>
                  <option value="小児神経科">小児神経科</option>
                  <option value="その他">その他</option>
                </select>
              </div>
            </div>

            {/* 経験・目標 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  経験年数
                </label>
                <select
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">選択してください</option>
                  <option value="1">1年未満</option>
                  <option value="2">1-2年</option>
                  <option value="3">3-5年</option>
                  <option value="5">5-10年</option>
                  <option value="10">10年以上</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Target className="inline w-4 h-4 mr-1" />
                  目標レベル
                </label>
                <select
                  name="targetLevel"
                  value={formData.targetLevel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">選択してください</option>
                  <option value="3">レベル3（基本）</option>
                  <option value="5">レベル5（中級）</option>
                  <option value="7">レベル7（上級）</option>
                  <option value="9">レベル9（専門医）</option>
                </select>
              </div>
            </div>

            {/* 専門分野・学習目標 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                専門分野
              </label>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="例：循環器、神経、新生児など"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                学習目標
              </label>
              <textarea
                name="studyGoal"
                value={formData.studyGoal}
                onChange={handleChange}
                rows={3}
                placeholder="例：小児科専門医取得、特定分野の知識向上など"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* 学習目標設定 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  1日の学習目標（問題数）
                </label>
                <input
                  type="number"
                  name="dailyGoal"
                  value={formData.dailyGoal}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  1週間の学習目標（問題数）
                </label>
                <input
                  type="number"
                  name="weeklyGoal"
                  value={formData.weeklyGoal}
                  onChange={handleChange}
                  min="1"
                  max="500"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
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
                disabled={loading || success}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登録中...' : success ? '登録完了！' : '登録する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
