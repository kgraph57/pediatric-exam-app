import { useState, useEffect } from 'react';
import { UserPlus, Copy, Trash2, Mail, Clock, CheckCircle, XCircle } from 'lucide-react';

export function InvitationManagement() {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    hospital: '',
    department: '',
    expiresInDays: 30
  });
  const [creating, setCreating] = useState(false);

  // 招待コード一覧を取得
  const fetchInvitations = async () => {
    try {
      setLoading(true);
      // クライアントサイドのlocalStorageから招待コードを取得
      const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');
      setInvitations(invitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  // 招待コードを作成
  const handleCreateInvitation = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        // ローカルストレージに招待コードを保存（クライアントサイド）
        const newInvitation = responseData.invitation;
        const existingInvitations = JSON.parse(localStorage.getItem('invitations') || '[]');
        existingInvitations.unshift(newInvitation);
        localStorage.setItem('invitations', JSON.stringify(existingInvitations));
        
        setInvitations(prev => [newInvitation, ...prev]);
        setShowCreateModal(false);
        setFormData({
          email: '',
          name: '',
          hospital: '',
          department: '',
          expiresInDays: 30
        });
        
        // 招待コードをクリップボードにコピー
        navigator.clipboard.writeText(newInvitation.code);
        alert(`招待コードが作成されました！\n\n招待コード: ${newInvitation.code}\n\nクリップボードにコピーしました。`);
      } else {
        alert(responseData.message || '招待コードの作成に失敗しました');
      }
    } catch (error) {
      console.error('Error creating invitation:', error);
      alert('ネットワークエラーが発生しました');
    } finally {
      setCreating(false);
    }
  };

  // 招待コードをコピー
  const copyInvitationCode = (code) => {
    navigator.clipboard.writeText(code);
    alert('招待コードをコピーしました');
  };

  // 招待コードを削除
  const handleDeleteInvitation = async (invitationId) => {
    if (confirm('この招待コードを削除しますか？')) {
      try {
        // ローカルストレージから削除
        const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');
        const updatedInvitations = invitations.filter(inv => inv.id !== invitationId);
        localStorage.setItem('invitations', JSON.stringify(updatedInvitations));
        
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        alert('招待コードが削除されました');
      } catch (error) {
        console.error('Error deleting invitation:', error);
        alert('招待コードの削除に失敗しました');
      }
    }
  };

  // 招待コードのステータスを取得
  const getInvitationStatus = (invitation) => {
    if (invitation.usedAt) return 'used';
    if (new Date(invitation.expiresAt) < new Date()) return 'expired';
    return 'active';
  };

  // ステータスアイコンを取得
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'used':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // ステータスラベルを取得
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return '有効';
      case 'used':
        return '使用済み';
      case 'expired':
        return '期限切れ';
      default:
        return '不明';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">招待コード情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          招待コード管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ユーザーを招待するためのコードを管理します
        </p>
      </div>

      {/* 招待コード作成ボタン */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          新しい招待コードを作成
        </button>
      </div>

      {/* 招待コード一覧 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            招待コード一覧 ({invitations.length}件)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  招待コード
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  招待先
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  有効期限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  作成日
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {invitations.map((invitation) => {
                const status = getInvitationStatus(invitation);
                return (
                  <tr key={invitation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {invitation.code}
                        </code>
                        <button
                          onClick={() => copyInvitationCode(invitation.code)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          title="コピー"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {invitation.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {invitation.email}
                        </div>
                        {invitation.hospital && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {invitation.hospital} {invitation.department && `・${invitation.department}`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(status)}
                        <span className="text-sm text-gray-900 dark:text-white">
                          {getStatusLabel(status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invitation.expiresAt).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(invitation.createdAt).toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyInvitationCode(invitation.code)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="コピー"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {status === 'active' && (
                          <button
                            onClick={() => handleDeleteInvitation(invitation.id)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {invitations.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            招待コードがありません
          </div>
        )}
      </div>

      {/* 招待コード作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                招待コードを作成
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateInvitation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  メールアドレス *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  名前 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  病院
                </label>
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  部署
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  有効期限（日数）
                </label>
                <select
                  value={formData.expiresInDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiresInDays: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value={7}>7日</option>
                  <option value={14}>14日</option>
                  <option value={30}>30日</option>
                  <option value={60}>60日</option>
                  <option value={90}>90日</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {creating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <UserPlus className="w-4 h-4" />
                  )}
                  {creating ? '作成中...' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
