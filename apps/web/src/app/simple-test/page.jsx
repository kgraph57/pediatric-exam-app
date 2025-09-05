import { useState, useEffect } from 'react';

export default function SimpleTestPage() {
  const [status, setStatus] = useState('Loading...');
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    const testHealth = async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        setHealthData(data);
        setStatus('Success!');
      } catch (error) {
        console.error('Health Check Error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    testHealth();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          シンプルテストページ
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold mb-4">ヘルスチェック</h2>
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

        {healthData && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">レスポンスデータ</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
          <h2 className="text-xl font-semibold mb-4">次のステップ</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>✅ ヘルスチェックが成功した場合:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">メインアプリ</a>にアクセス</li>
              <li><a href="/test" className="text-blue-600 dark:text-blue-400 hover:underline">詳細テスト</a>を実行</li>
              <li><a href="/admin" className="text-blue-600 dark:text-blue-400 hover:underline">管理画面</a>でテストユーザーを作成</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


