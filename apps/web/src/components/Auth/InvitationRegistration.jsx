import { useState } from 'react';
import { UserPlus, Copy, CheckCircle } from 'lucide-react';

export function InvitationRegistration({ onSuccess }) {
  const [invitationCode, setInvitationCode] = useState('');
  const [userData, setUserData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: コード入力, 2: ユーザー情報入力
  const [invitationInfo, setInvitationInfo] = useState(null);

  // 招待コードを検証
  const handleValidateCode = async () => {
    if (!invitationCode.trim()) {
      alert('招待コードを入力してください');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/invitations/${invitationCode}`);
      const data = await response.json();

      if (response.ok && data.valid) {
        setInvitationInfo(data.invitation);
        setStep(2);
      } else {
        alert(data.message || '招待コードが無効です');
      }
    } catch (error) {
      console.error('Error validating invitation:', error);
      alert('招待コードの検証に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // ユーザー登録を実行
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (userData.password !== userData.confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }

    if (userData.password.length < 6) {
      alert('パスワードは6文字以上で入力してください');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/invitations/${invitationCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: userData.password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 登録されたユーザー情報をlocalStorageに保存
        const newUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // 登録済みユーザーリストに追加
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        registeredUsers.push({
          ...newUser,
          password: userData.password // ログイン用にパスワードも保存
        });
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // 招待コードを使用済みにマーク
        const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');
        const invitationIndex = invitations.findIndex(inv => inv.code === invitationCode);
        if (invitationIndex !== -1) {
          invitations[invitationIndex].usedAt = new Date().toISOString();
          localStorage.setItem('invitations', JSON.stringify(invitations));
        }

        alert('ユーザー登録が完了しました！');
        if (onSuccess) {
          onSuccess(newUser);
        }
      } else {
        alert(data.message || 'ユーザー登録に失敗しました');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      alert('ユーザー登録中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  // 招待コードをコピー
  const copyInvitationCode = () => {
    navigator.clipboard.writeText(invitationCode);
    alert('招待コードをコピーしました');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="text-center mb-6">
        <UserPlus className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          招待コードで登録
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          管理者から受け取った招待コードを入力してください
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              招待コード
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={invitationCode}
                onChange={(e) => setInvitationCode(e.target.value.toUpperCase())}
                placeholder="例: ABC12345"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
              />
              <button
                onClick={copyInvitationCode}
                disabled={!invitationCode}
                className="px-3 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
                title="コピー"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleValidateCode}
            disabled={loading || !invitationCode.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
            {loading ? '検証中...' : '招待コードを確認'}
          </button>
        </div>
      )}

      {step === 2 && invitationInfo && (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                招待コードが確認されました
              </span>
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              <p><strong>名前:</strong> {invitationInfo.name}</p>
              <p><strong>メール:</strong> {invitationInfo.email}</p>
              {invitationInfo.hospital && (
                <p><strong>病院:</strong> {invitationInfo.hospital}</p>
              )}
              {invitationInfo.department && (
                <p><strong>部署:</strong> {invitationInfo.department}</p>
              )}
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                パスワード
              </label>
              <input
                type="password"
                value={userData.password}
                onChange={(e) => setUserData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="6文字以上のパスワード"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                パスワード（確認）
              </label>
              <input
                type="password"
                value={userData.confirmPassword}
                onChange={(e) => setUserData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="パスワードを再入力"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                戻る
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {loading ? '登録中...' : '登録完了'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
