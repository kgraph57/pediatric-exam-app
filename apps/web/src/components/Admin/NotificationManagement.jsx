import { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';

export function NotificationManagement() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showNotificationDetail, setShowNotificationDetail] = useState(false);

  // 通知一覧を取得
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('status', filter);
      params.append('limit', '100');

      const response = await fetch(`/api/notifications?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  // 通知を既読にする
  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, status: 'read', readAt: new Date().toISOString() }
              : notif
          )
        );
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // 通知を削除
  const handleDeleteNotification = async (notificationId) => {
    if (confirm('この通知を削除しますか？')) {
      try {
        // ローカルストレージから削除（デモモード）
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        const updatedNotifications = notifications.filter(notif => notif.id !== notificationId);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        alert('通知が削除されました');
      } catch (error) {
        console.error('Error deleting notification:', error);
        alert('通知の削除に失敗しました');
      }
    }
  };

  // 通知詳細を表示
  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    setShowNotificationDetail(true);
    
    // 未読の場合は既読にする
    if (notification.status === 'unread') {
      handleMarkAsRead(notification.id);
    }
  };

  // 通知タイプのアイコンを取得
  const getNotificationIcon = (type, priority) => {
    const iconClass = priority === 'high' ? 'text-red-500' : 
                     priority === 'medium' ? 'text-orange-500' : 'text-blue-500';
    
    switch (type) {
      case 'error':
        return <XCircle className={`w-5 h-5 ${iconClass}`} />;
      case 'warning':
        return <AlertTriangle className={`w-5 h-5 ${iconClass}`} />;
      case 'success':
        return <CheckCircle className={`w-5 h-5 ${iconClass}`} />;
      case 'info':
      default:
        return <Info className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  // 通知タイプの日本語名を取得
  const getNotificationTypeLabel = (type) => {
    const typeLabels = {
      'error': 'エラー',
      'warning': '警告',
      'success': '成功',
      'info': '情報',
      'user_activity': 'ユーザー活動',
      'system': 'システム',
      'security': 'セキュリティ'
    };
    return typeLabels[type] || type;
  };

  // 優先度の日本語名を取得
  const getPriorityLabel = (priority) => {
    const priorityLabels = {
      'high': '高',
      'medium': '中',
      'normal': '低'
    };
    return priorityLabels[priority] || priority;
  };

  // 優先度の色を取得
  const getPriorityColor = (priority) => {
    const priorityColors = {
      'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'medium': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'normal': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
    return priorityColors[priority] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">通知情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          通知管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          システム通知とアラートを管理します
        </p>
      </div>

      {/* フィルター */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            ステータス:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            <option value="all">すべて</option>
            <option value="unread">未読</option>
            <option value="read">既読</option>
          </select>
        </div>
      </div>

      {/* 通知一覧 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            通知一覧 ({notifications.length}件)
          </h2>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type, notification.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                        {getPriorityLabel(notification.priority)}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {getNotificationTypeLabel(notification.type)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{new Date(notification.createdAt).toLocaleString('ja-JP')}</span>
                      {notification.status === 'unread' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          未読
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewNotification(notification)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="詳細表示"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {notification.status === 'unread' && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="既読にする"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
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

        {notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            通知がありません
          </div>
        )}
      </div>

      {/* 通知詳細モーダル */}
      {showNotificationDetail && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                {getNotificationIcon(selectedNotification.type, selectedNotification.priority)}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  通知詳細
                </h3>
              </div>
              <button
                onClick={() => setShowNotificationDetail(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  タイトル
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedNotification.title}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  メッセージ
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    タイプ
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {getNotificationTypeLabel(selectedNotification.type)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    優先度
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {getPriorityLabel(selectedNotification.priority)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    作成日時
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {new Date(selectedNotification.createdAt).toLocaleString('ja-JP')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ステータス
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedNotification.status === 'unread' ? '未読' : '既読'}
                  </p>
                </div>
              </div>

              {selectedNotification.data && Object.keys(selectedNotification.data).length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    追加データ
                  </label>
                  <pre className="mt-1 text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-3 rounded-lg overflow-auto">
                    {JSON.stringify(selectedNotification.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowNotificationDetail(false)}
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
