import { useState, useEffect } from 'react';
import { Database, Download, Upload, Trash2, RotateCcw, Plus, Calendar, HardDrive } from 'lucide-react';

export function BackupManagement() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(null);

  // バックアップ一覧を取得
  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/backup');
      if (response.ok) {
        const data = await response.json();
        setBackups(data.backups || []);
      } else {
        console.error('Failed to fetch backups');
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  // バックアップを作成
  const handleCreateBackup = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setBackups(prev => [responseData.backup, ...prev]);
        setShowCreateModal(false);
        setFormData({ name: '', description: '' });
        alert('バックアップが作成されました');
      } else {
        alert(responseData.message || 'バックアップの作成に失敗しました');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('ネットワークエラーが発生しました');
    } finally {
      setCreating(false);
    }
  };

  // バックアップを復元
  const handleRestoreBackup = async (backupId) => {
    if (confirm('このバックアップを復元しますか？現在のデータは上書きされます。この操作は取り消せません。')) {
      try {
        setRestoring(backupId);
        const response = await fetch(`/api/backup/${backupId}/restore`, {
          method: 'POST'
        });

        const responseData = await response.json();

        if (response.ok) {
          alert('バックアップが復元されました。ページをリロードしてください。');
          // ページをリロード
          window.location.reload();
        } else {
          alert(responseData.message || 'バックアップの復元に失敗しました');
        }
      } catch (error) {
        console.error('Error restoring backup:', error);
        alert('バックアップの復元中にエラーが発生しました');
      } finally {
        setRestoring(null);
      }
    }
  };

  // バックアップをダウンロード
  const handleDownloadBackup = async (backup) => {
    try {
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${backup.name}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading backup:', error);
      alert('バックアップのダウンロードに失敗しました');
    }
  };

  // バックアップを削除
  const handleDeleteBackup = async (backupId) => {
    if (confirm('このバックアップを削除しますか？この操作は取り消せません。')) {
      try {
        // ローカルストレージから削除（デモモード）
        const backups = JSON.parse(localStorage.getItem('backups') || '[]');
        const updatedBackups = backups.filter(backup => backup.id !== backupId);
        localStorage.setItem('backups', JSON.stringify(updatedBackups));
        
        setBackups(prev => prev.filter(backup => backup.id !== backupId));
        alert('バックアップが削除されました');
      } catch (error) {
        console.error('Error deleting backup:', error);
        alert('バックアップの削除に失敗しました');
      }
    }
  };

  // ファイルサイズをフォーマット
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">バックアップ情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          バックアップ管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          システムデータのバックアップと復元を管理します
        </p>
      </div>

      {/* バックアップ作成ボタン */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          新しいバックアップを作成
        </button>
      </div>

      {/* バックアップ一覧 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            バックアップ一覧 ({backups.length}件)
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {backups.map((backup) => (
            <div key={backup.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-md font-medium text-gray-900 dark:text-white mb-1">
                      {backup.name}
                    </h3>
                    {backup.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {backup.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(backup.createdAt).toLocaleString('ja-JP')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Database className="w-3 h-3" />
                        <span>{formatFileSize(backup.size)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleDownloadBackup(backup)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="ダウンロード"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRestoreBackup(backup.id)}
                    disabled={restoring === backup.id}
                    className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                    title="復元"
                  >
                    {restoring === backup.id ? (
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <RotateCcw className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteBackup(backup.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {backups.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            バックアップがありません
          </div>
        )}
      </div>

      {/* バックアップ作成モーダル */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                バックアップを作成
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateBackup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  バックアップ名 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="例: 月次バックアップ"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  説明（オプション）
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  placeholder="バックアップの内容や目的を記述してください"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
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
                    <Database className="w-4 h-4" />
                  )}
                  {creating ? '作成中...' : '作成'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 注意事項 */}
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Database className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              バックアップについて
            </h3>
            <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• バックアップにはユーザーデータ、ログ、設定などが含まれます</li>
              <li>• 復元時は現在のデータが上書きされます</li>
              <li>• 定期的なバックアップの作成を推奨します</li>
              <li>• バックアップファイルは安全な場所に保管してください</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
