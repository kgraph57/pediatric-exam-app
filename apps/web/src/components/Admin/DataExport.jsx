import { useState } from 'react';
import { Download, FileText, Database, Users, Bell, Calendar } from 'lucide-react';

export function DataExport() {
  const [exportType, setExportType] = useState('users');
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [exporting, setExporting] = useState(false);

  // エクスポートを実行
  const handleExport = async () => {
    try {
      setExporting(true);
      
      const params = new URLSearchParams();
      params.append('type', exportType);
      params.append('format', exportFormat);
      
      if (dateRange.startDate) {
        params.append('startDate', dateRange.startDate);
      }
      
      if (dateRange.endDate) {
        params.append('endDate', dateRange.endDate);
      }

      const response = await fetch(`/api/export?${params.toString()}`);
      
      if (response.ok) {
        // ファイルをダウンロード
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // ファイル名を取得
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `${exportType}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }
        
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        alert('データのエクスポートが完了しました');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'エクスポートに失敗しました');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('エクスポート中にエラーが発生しました');
    } finally {
      setExporting(false);
    }
  };

  // エクスポートタイプのオプション
  const exportTypeOptions = [
    {
      value: 'users',
      label: 'ユーザーデータ',
      description: '登録ユーザーの基本情報と学習進捗',
      icon: Users
    },
    {
      value: 'logs',
      label: '利用ログ',
      description: 'ユーザーのアクションログと利用状況',
      icon: FileText
    },
    {
      value: 'invitations',
      label: '招待データ',
      description: '招待コードとその使用状況',
      icon: Bell
    },
    {
      value: 'analytics',
      label: '分析データ',
      description: 'システム全体の統計と分析結果',
      icon: Database
    }
  ];

  // フォーマットのオプション
  const formatOptions = [
    {
      value: 'csv',
      label: 'CSV',
      description: 'ExcelやGoogleスプレッドシートで開けます'
    },
    {
      value: 'json',
      label: 'JSON',
      description: 'プログラムで処理しやすい形式'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          データエクスポート
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          システムのデータをCSVまたはJSON形式でエクスポートできます
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* エクスポートタイプ選択 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            エクスポートするデータを選択
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exportTypeOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <label
                  key={option.value}
                  className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    exportType === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <input
                    type="radio"
                    name="exportType"
                    value={option.value}
                    checked={exportType === option.value}
                    onChange={(e) => setExportType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`w-5 h-5 mt-0.5 ${
                      exportType === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                    }`} />
                    <div>
                      <div className={`text-sm font-medium ${
                        exportType === option.value ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      }`}>
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* フォーマット選択 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            エクスポート形式を選択
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formatOptions.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                  exportFormat === option.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value={option.value}
                  checked={exportFormat === option.value}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center ${
                    exportFormat === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {exportFormat === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${
                      exportFormat === option.value ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                    }`}>
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 日付範囲選択（ログデータの場合） */}
        {exportType === 'logs' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              日付範囲を指定（オプション）
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  開始日
                </label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  終了日
                </label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              日付を指定しない場合は、すべてのデータがエクスポートされます
            </p>
          </div>
        )}

        {/* エクスポート実行ボタン */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                エクスポート実行
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                選択した設定でデータをエクスポートします
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {exporting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Download className="w-5 h-5" />
              )}
              {exporting ? 'エクスポート中...' : 'エクスポート実行'}
            </button>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                注意事項
              </h3>
              <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                <li>• エクスポートされたデータには個人情報が含まれます。取り扱いにご注意ください</li>
                <li>• 大量のデータをエクスポートする場合、時間がかかる場合があります</li>
                <li>• エクスポート中はブラウザを閉じないでください</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
