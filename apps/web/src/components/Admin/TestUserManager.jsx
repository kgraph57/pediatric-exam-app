import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, RefreshCw, Trash2, Users, Eye, Settings } from 'lucide-react';

export function TestUserManager() {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    specialty: '一般',
    experienceYears: '1',
    targetLevel: 5
  });

  // テストユーザー一覧を取得
  const { data: testUsers, isLoading } = useQuery({
    queryKey: ['testUsers'],
    queryFn: async () => {
      const response = await fetch('/api/test-users');
      if (!response.ok) throw new Error('Failed to fetch test users');
      return response.json();
    },
  });

  // テストユーザー作成
  const createUserMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await fetch('/api/test-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to create test user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testUsers']);
      setShowCreateForm(false);
      setCreateForm({
        name: '',
        email: '',
        specialty: '一般',
        experienceYears: '1',
        targetLevel: 5
      });
    },
  });

  // テストユーザーリセット
  const resetUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`/api/test-users/${userId}/reset`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to reset test user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testUsers']);
    },
  });

  // テストユーザー削除
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      const response = await fetch(`/api/test-users/${userId}/reset`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete test user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['testUsers']);
    },
  });

  const handleCreateUser = (e) => {
    e.preventDefault();
    createUserMutation.mutate({
      name: createForm.name,
      email: createForm.email,
      profile: {
        specialty: createForm.specialty,
        experience_years: createForm.experienceYears,
        target_level: createForm.targetLevel
      }
    });
  };

  const handleResetUser = (userId) => {
    if (confirm('このユーザーの学習データをリセットしますか？')) {
      resetUserMutation.mutate(userId);
    }
  };

  const handleDeleteUser = (userId) => {
    if (confirm('このテストユーザーを削除しますか？')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const switchToUser = (userId) => {
    // ユーザー切り替え機能（実装予定）
    console.log('Switching to user:', userId);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            テストユーザー管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            テストユーザーの作成・管理・リセットを行います
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus size={20} />
          新規作成
        </button>
      </div>

      {/* テストユーザー作成フォーム */}
      {showCreateForm && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4">テストユーザー作成</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  名前 *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
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
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  専門分野
                </label>
                <select
                  value={createForm.specialty}
                  onChange={(e) => setCreateForm({ ...createForm, specialty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="一般">一般</option>
                  <option value="循環器">循環器</option>
                  <option value="呼吸器">呼吸器</option>
                  <option value="消化器">消化器</option>
                  <option value="神経">神経</option>
                  <option value="内分泌・代謝">内分泌・代謝</option>
                  <option value="血液・腫瘍">血液・腫瘍</option>
                  <option value="免疫・アレルギー">免疫・アレルギー</option>
                  <option value="救急">救急</option>
                  <option value="新生児・周産期">新生児・周産期</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  経験年数
                </label>
                <select
                  value={createForm.experienceYears}
                  onChange={(e) => setCreateForm({ ...createForm, experienceYears: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="1">1年</option>
                  <option value="2">2年</option>
                  <option value="3">3年</option>
                  <option value="4">4年</option>
                  <option value="5">5年</option>
                  <option value="6">6年</option>
                  <option value="7">7年</option>
                  <option value="8">8年</option>
                  <option value="9">9年</option>
                  <option value="10">10年以上</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={createUserMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {createUserMutation.isPending ? '作成中...' : '作成'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {/* テストユーザー一覧 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users size={20} />
            テストユーザー一覧 ({testUsers?.total || 0})
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {testUsers?.users?.map((user) => (
            <div key={user.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </h3>
                    <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      レベル {user.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {user.email}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>解答数: {user.total_answered}</span>
                    <span>正解数: {user.total_correct}</span>
                    <span>連続学習: {user.streak}日</span>
                    <span>作成日: {new Date(user.created_at).toLocaleDateString('ja-JP')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => switchToUser(user.id)}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    title="このユーザーに切り替え"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleResetUser(user.id)}
                    disabled={resetUserMutation.isPending}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                    title="学習データをリセット"
                  >
                    <RefreshCw size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deleteUserMutation.isPending}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="ユーザーを削除"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {(!testUsers?.users || testUsers.users.length === 0) && (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              テストユーザーが存在しません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

