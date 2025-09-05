import { useState } from 'react';
import { HelpCircle, Search, BookOpen, MessageCircle, Mail, Phone, Clock, ChevronDown, ChevronRight } from 'lucide-react';

export function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState(new Set());

  // FAQデータ
  const faqData = [
    {
      category: 'getting-started',
      title: 'はじめに',
      items: [
        {
          id: 'how-to-register',
          question: 'ユーザー登録はどのように行いますか？',
          answer: 'ヘッダーの「新規登録」ボタンをクリックして、必要事項を入力してください。メールアドレス、名前、パスワードは必須項目です。'
        },
        {
          id: 'how-to-login',
          question: 'ログインはどのように行いますか？',
          answer: 'ヘッダーの「ログイン」ボタンをクリックして、登録したメールアドレスとパスワードを入力してください。'
        },
        {
          id: 'demo-user',
          question: 'デモユーザーとは何ですか？',
          answer: 'デモユーザーは、アプリケーションの機能を試すためのサンプルユーザーです。実際のユーザー登録を行う前に、機能を体験できます。'
        }
      ]
    },
    {
      category: 'practice',
      title: '問題演習について',
      items: [
        {
          id: 'how-to-start-practice',
          question: '問題演習を始めるにはどうすればいいですか？',
          answer: 'サイドバーの「問題演習」をクリックして、学習したいカテゴリを選択してください。各カテゴリの「演習開始」ボタンをクリックすると問題が始まります。'
        },
        {
          id: 'practice-categories',
          question: 'どのようなカテゴリの問題がありますか？',
          answer: '循環器、呼吸器、消化器、神経、内分泌・代謝、血液・腫瘍、免疫・アレルギーなどのカテゴリがあります。各カテゴリには約50問の問題が含まれています。'
        },
        {
          id: 'progress-tracking',
          question: '学習進捗はどのように記録されますか？',
          answer: '各問題の回答結果は自動的に記録され、カテゴリ別の進捗率として表示されます。正解率や連続正解数も追跡されます。'
        },
        {
          id: 'reset-progress',
          question: '学習進捗をリセットできますか？',
          answer: 'はい、ヘッダーの「学習進捗リセット」ボタンから進捗をリセットできます。ただし、この操作は取り消せませんのでご注意ください。'
        }
      ]
    },
    {
      category: 'profile',
      title: 'プロフィール・設定',
      items: [
        {
          id: 'update-profile',
          question: 'プロフィール情報を変更するにはどうすればいいですか？',
          answer: 'ヘッダーのユーザー名をクリックして「プロフィール編集」を選択してください。病院、部署、経験年数、学習目標などを変更できます。'
        },
        {
          id: 'learning-goals',
          question: '学習目標はどのように設定しますか？',
          answer: 'プロフィール編集画面で、1日の目標問題数、1週間の目標問題数、学習時間帯、学習頻度などを設定できます。'
        },
        {
          id: 'level-system',
          question: 'レベルシステムについて教えてください',
          answer: 'レベルは学習進捗に応じて自動的に上がります。レベル1から7まであり、より高いレベルを目指すことで学習のモチベーションを維持できます。'
        }
      ]
    },
    {
      category: 'technical',
      title: '技術的な問題',
      items: [
        {
          id: 'browser-support',
          question: 'どのブラウザで使用できますか？',
          answer: 'Chrome、Firefox、Safari、Edgeなどの主要なブラウザで使用できます。最新バージョンの使用を推奨します。'
        },
        {
          id: 'mobile-support',
          question: 'スマートフォンでも使用できますか？',
          answer: 'はい、レスポンシブデザインに対応しているため、スマートフォンやタブレットでも快適に使用できます。'
        },
        {
          id: 'data-storage',
          question: 'データはどこに保存されますか？',
          answer: '現在はブラウザのローカルストレージに保存されています。異なるブラウザやデバイスではデータが共有されません。'
        },
        {
          id: 'offline-support',
          question: 'オフラインでも使用できますか？',
          answer: '現在はオンライン環境での使用のみサポートしています。インターネット接続が必要です。'
        }
      ]
    },
    {
      category: 'troubleshooting',
      title: 'トラブルシューティング',
      items: [
        {
          id: 'login-problem',
          question: 'ログインできない場合はどうすればいいですか？',
          answer: 'メールアドレスとパスワードが正しいか確認してください。パスワードを忘れた場合は、新規登録を再度行ってください。'
        },
        {
          id: 'progress-not-saving',
          question: '学習進捗が保存されない場合はどうすればいいですか？',
          answer: 'ブラウザのローカルストレージが有効になっているか確認してください。プライベートブラウジングモードでは保存されない場合があります。'
        },
        {
          id: 'slow-loading',
          question: 'ページの読み込みが遅い場合はどうすればいいですか？',
          answer: 'インターネット接続を確認し、ブラウザのキャッシュをクリアしてみてください。それでも改善しない場合は、管理者にお問い合わせください。'
        }
      ]
    }
  ];

  // カテゴリ一覧
  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'getting-started', label: 'はじめに' },
    { value: 'practice', label: '問題演習' },
    { value: 'profile', label: 'プロフィール・設定' },
    { value: 'technical', label: '技術的な問題' },
    { value: 'troubleshooting', label: 'トラブルシューティング' }
  ];

  // フィルタリングされたFAQデータ
  const filteredFaqData = faqData.filter(category => 
    selectedCategory === 'all' || category.category === selectedCategory
  ).map(category => ({
    ...category,
    items: category.items.filter(item =>
      searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  // FAQアイテムの展開/折りたたみ
  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ヘルプセンター
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          よくある質問とサポート情報をご確認ください
        </p>
      </div>

      {/* 検索とフィルター */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="質問を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* FAQ一覧 */}
      <div className="space-y-6">
        {filteredFaqData.map((category) => (
          <div key={category.category} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {category.title}
              </h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {category.items.map((item) => (
                <div key={item.id} className="p-6">
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="w-full text-left flex items-center justify-between hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <h3 className="text-md font-medium text-gray-900 dark:text-white pr-4">
                      {item.question}
                    </h3>
                    {expandedItems.has(item.id) ? (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedItems.has(item.id) && (
                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 検索結果がない場合 */}
      {filteredFaqData.length === 0 && (
        <div className="text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            該当する質問が見つかりません
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            別のキーワードで検索するか、カテゴリを変更してみてください
          </p>
        </div>
      )}

      {/* お問い合わせ情報 */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
          お問い合わせ
        </h2>
        <p className="text-blue-800 dark:text-blue-200 mb-4">
          上記のFAQで解決しない場合は、お気軽にお問い合わせください。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                メール
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                support@example.com
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                電話
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                03-1234-5678
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                対応時間
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                平日 9:00-18:00
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
