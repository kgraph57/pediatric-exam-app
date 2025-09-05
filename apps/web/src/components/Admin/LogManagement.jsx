import { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, Eye, Calendar } from 'lucide-react';

export function LogManagement() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    startDate: '',
    endDate: ''
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showLogDetail, setShowLogDetail] = useState(false);

  // ログ一覧を取得
  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.action) params.append('action', filters.action);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      params.append('limit', '100');

      const response = await fetch(`/api/logs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      } else {
        console.error('Failed to fetch logs');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // フィルターを適用
  const handleApplyFilters = () => {
    fetchLogs();
  };

  // フィルターをリセット
  const handleResetFilters = () => {
    setFilters({
      userId: '',
      action: '',
      startDate: '',
      endDate: ''
    });
    fetchLogs();
  };

  // ログ詳細を表示
  const handleViewLog = (log) => {
    setSelectedLog(log);
    setShowLogDetail(true);
  };

  // ログをエクスポート
  const handleExportLogs = () => {
    const csvContent = [
      ['ID', 'ユーザーID', 'アクション', '詳細', 'タイムスタンプ', 'IPアドレス'].join(','),
      ...logs.map(log => [
        log.id,
        log.userId,
        log.action,
        JSON.stringify(log.details).replace(/"/g, '""'),
        log.timestamp,
        log.ipAddress
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `usage_logs_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // アクションの日本語名を取得
  const getActionLabel = (action) => {
    const actionLabels = {
      'login': 'ログイン',
      'logout': 'ログアウト',
      'register': 'ユーザー登録',
      'practice_start': '問題演習開始',
      'practice_answer': '問題回答',
      'practice_complete': '問題演習完了',
      'profile_update': 'プロフィール更新',
      'progress_reset': '進捗リセット',
      'invitation_use': '招待コード使用',
      'page_view': 'ページ閲覧',
      'error': 'エラー発生'
    };
    return actionLabels[action] || action;
  };

  // アクションの色を取得
  const getActionColor = (action) => {
    const actionColors = {
      'login': 'text-green-600 dark:text-green-400',
      'logout': 'text-gray-600 dark:text-gray-400',
      'register': 'text-blue-600 dark:text-blue-400',
      'practice_start': 'text-purple-600 dark:text-purple-400',
      'practice_answer': 'text-indigo-600 dark:text-indigo-400',
      'practice_complete': 'text-green-600 dark:text-green-400',
      'profile_update': 'text-yellow-600 dark:text-yellow-400',
      'progress_reset': 'text-orange-600 dark:text-orange-400',
      'invitation_use': 'text-pink-600 dark:text-pink-400',
      'page_view': 'text-gray-600 dark:text-gray-400',
      'error': 'text-red-600 dark:text-red-400'
    };
    return actionColors[action] || 'text-gray-600 dark:text-gray-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">ログ情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          利用ログ管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          ユーザーの利用状況とアクションログを確認できます
        </p>
      </div>

      {/* フィルター */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ユーザーID
            </label>
            <input
              type="text"
              value={filters.userId}
              onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="ユーザーIDで検索"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              アクション
            </label>
            <select
              value={filters.action}
              onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">すべて</option>
              <option value="login">ログイン</option>
              <option value="logout">ログアウト</option>
              <option value="register">ユーザー登録</option>
              <option value="practice_start">問題演習開始</option>
              <option value="practice_answer">問題回答</option>
              <option value="practice_complete">問題演習完了</option>
              <option value="profile_update">プロフィール更新</option>
              <option value="progress_reset">進捗リセット</option>
              <option value="invitation_use">招待コード使用</option>
              <option value="page_view">ページ閲覧</option>
              <option value="error">エラー発生</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              開始日
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              終了日
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            リセット
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4" />
            検索
          </button>
        </div>
      </div>

      {/* ログ一覧 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              ログ一覧 ({logs.length}件)
            </h2>
            <button
              onClick={handleExportLogs}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              CSVエクスポート
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  タイムスタンプ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ユーザーID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  アクション
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  IPアドレス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(log.timestamp).toLocaleString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {log.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {log.ipAddress}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewLog(log)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="詳細表示"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            該当するログが見つかりません
          </div>
        )}
      </div>

      {/* ログ詳細モーダル */}
      {showLogDetail && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                ログ詳細
              </h3>
              <button
                onClick={() => setShowLogDetail(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ID
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                    {selectedLog.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ユーザーID
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedLog.userId}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    アクション
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {getActionLabel(selectedLog.action)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    タイムスタンプ
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedLog.timestamp).toLocaleString('ja-JP')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    IPアドレス
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedLog.ipAddress}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ユーザーエージェント
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  詳細情報
                </label>
                <pre className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-auto">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowLogDetail(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
