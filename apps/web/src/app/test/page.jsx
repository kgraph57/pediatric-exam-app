import { useState, useEffect } from 'react';

export default function TestPage() {
  const [status, setStatus] = useState('Loading...');
  const [data, setData] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        // 問題統計のテスト
        const statsResponse = await fetch('/api/questions/stats');
        const statsData = await statsResponse.json();
        
        // ユーザー情報のテスト
        const userResponse = await fetch('/api/users/demo');
        const userData = await userResponse.json();
        
        setData({
          stats: statsData,
          user: userData
        });
        setStatus('Success!');
      } catch (error) {
        console.error('API Test Error:', error);
        setStatus(`Error: ${error.message}`);
      }
    };

    testAPI();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          アプリ動作確認ページ
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold mb-4">ステータス</h2>
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

        {data && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">問題統計</h2>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(data.stats, null, 2)}
              </pre>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify(data.user, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 mt-6">
          <h2 className="text-xl font-semibold mb-4">次のステップ</h2>
          <div className="space-y-2 text-gray-600 dark:text-gray-400">
            <p>✅ アプリが正常に動作している場合:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><a href="/" className="text-blue-600 dark:text-blue-400 hover:underline">メインアプリ</a>にアクセス</li>
              <li><a href="/admin" className="text-blue-600 dark:text-blue-400 hover:underline">管理画面</a>でテストユーザーを作成</li>
              <li>実際の学習を開始</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}




