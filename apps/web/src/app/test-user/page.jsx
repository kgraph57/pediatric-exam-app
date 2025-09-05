import { useState, useEffect } from 'react';

export default function TestUserPage() {
  const [status, setStatus] = useState('Ready');
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // テストユーザー一覧を取得
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/test-simple');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // テストユーザー作成
  const createUser = async (e) => {
    e.preventDefault();
    setStatus('Creating...');

    try {
      const response = await fetch('/api/test-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('Success!');
        setFormData({ name: '', email: '' });
        fetchUsers(); // 一覧を更新
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          テストユーザー作成テスト
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold mb-4">テストユーザー作成</h2>
          <form onSubmit={createUser} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                名前 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                メールアドレス *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              テストユーザー作成
            </button>
          </form>
          
          <div className="mt-4">
            <div className={`px-4 py-2 rounded-lg ${
              status === 'Success!' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : status.startsWith('Error') 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {status}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4">テストユーザー一覧 ({users.length})</h2>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{user.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      レベル: {user.level} | 解答数: {user.total_answered} | 正解数: {user.total_correct}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </div>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                テストユーザーが存在しません
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
          <h2 className="text-xl font-semibold mb-4">次のステップ</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>✅ テストユーザーが作成できた場合:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">メインアプリ</a>にアクセス</li>
              <li><a href="/admin" className="text-blue-600 dark:text-blue-400 hover:underline">管理画面</a>で詳細管理</li>
              <li>実際の学習を開始</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


