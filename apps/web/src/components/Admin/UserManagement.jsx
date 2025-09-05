import { useState, useEffect } from 'react';
import { Users, Eye, Edit, Trash2, UserPlus, Search, Filter, BarChart3 } from 'lucide-react';
import { UserEditModal } from './UserEditModal';
import { UserProgressModal } from './UserProgressModal';

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [progressUser, setProgressUser] = useState(null);

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // フィルタリングされたユーザー一覧
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.hospital?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = filterLevel === 'all' || user.level.toString() === filterLevel;
    
    return matchesSearch && matchesLevel;
  });

  // ユーザー詳細を表示
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  // ユーザー進捗を表示
  const handleViewProgress = (user) => {
    setProgressUser(user);
    setShowProgressModal(true);
  };

  // ユーザー編集
  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  // ユーザー保存
  const handleSaveUser = (updatedUser) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    ));
    setShowEditModal(false);
    setEditingUser(null);
  };

  // ユーザー削除
  const handleDeleteUser = async (userId) => {
    if (confirm('このユーザーを削除しますか？この操作は取り消せません。')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // ユーザー一覧を更新
          setUsers(prev => prev.filter(user => user.id !== userId));
          alert('ユーザーが削除されました');
        } else {
          const data = await response.json();
          alert(data.message || 'ユーザーの削除に失敗しました');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('ユーザーの削除に失敗しました');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">ユーザー情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ユーザー管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          登録されているユーザーの一覧と管理を行います
        </p>
      </div>

      {/* 検索・フィルター */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="ユーザー名、メール、病院で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">全レベル</option>
              <option value="1">レベル1</option>
              <option value="2">レベル2</option>
              <option value="3">レベル3</option>
              <option value="4">レベル4</option>
              <option value="5">レベル5</option>
              <option value="6">レベル6</option>
              <option value="7">レベル7</option>
            </select>
          </div>
        </div>
      </div>

      {/* ユーザー一覧 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              ユーザー一覧 ({filteredUsers.length}人)
            </h2>
            <button
              onClick={() => {/* 新規ユーザー追加 */}}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              新規ユーザー
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ユーザー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  病院・部署
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  レベル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  進捗
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  登録日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {user.hospital || '-'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {user.department || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      レベル{user.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      回答: {user.totalAnswered || 0}問
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      正解率: {user.totalAnswered > 0 ? Math.round((user.totalCorrect || 0) / user.totalAnswered * 100) : 0}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="詳細表示"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewProgress(user)}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        title="進捗管理"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        title="編集"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.id !== 'demo' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            該当するユーザーが見つかりません
          </div>
        )}
      </div>

      {/* ユーザー詳細モーダル */}
      {showUserDetail && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ユーザー詳細
              </h3>
              <button
                onClick={() => setShowUserDetail(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    名前
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedUser.name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    メールアドレス
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    病院
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedUser.hospital || '-'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    部署
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedUser.department || '-'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    経験年数
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedUser.experienceYears || '-'}年
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    目標レベル
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    レベル{selectedUser.targetLevel || '-'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  専門分野
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedUser.specialty || '-'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  学習目標
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedUser.studyGoal || '-'}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    総回答数
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedUser.totalAnswered || 0}問
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    正解数
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedUser.totalCorrect || 0}問
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    連続正解
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedUser.streak || 0}問
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    登録日
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedUser.createdAt).toLocaleString('ja-JP')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    最終ログイン
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedUser.lastLogin).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowUserDetail(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ユーザー編集モーダル */}
      <UserEditModal
        user={editingUser}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
      />

      {/* ユーザー進捗モーダル */}
      <UserProgressModal
        user={progressUser}
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false);
          setProgressUser(null);
        }}
      />
    </div>
  );
}
