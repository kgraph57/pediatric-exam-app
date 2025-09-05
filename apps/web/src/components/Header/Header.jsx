import { Home, Menu, Settings, User, UserPlus, LogIn, RotateCcw } from "lucide-react";
import { useState } from "react";
import { UserProfileModal } from "./UserProfileModal";
import { UserRegistration } from "../Auth/UserRegistration";
import { LoginModal } from "../Auth/LoginModal";
import { ResetProgressModal } from "../Auth/ResetProgressModal";
import { InvitationRegistration } from "../Auth/InvitationRegistration";

export function Header({ user, onToggleSidebar, onHomeClick, onUserUpdate, onRefreshUserData }) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#121212] border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-8 py-3 flex justify-between items-center h-16">
        {/* Left: Sidebar toggle (desktop) + Home */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="hidden lg:inline-flex p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-md border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            aria-label="サイドバーを切り替え"
          >
            <Menu size={20} />
          </button>
          <button
            onClick={onHomeClick}
            className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="ホームに戻る"
          >
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        {/* User info and settings */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {user?.name || 'ユーザー'}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  レベル {user?.level || 1}
                </p>
                {user?.department && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    • {user.department}
                  </span>
                )}
                {user?.experienceYears !== undefined && user.experienceYears !== '' && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    • {user.experienceYears}年目
                  </span>
                )}
              </div>
            </div>
            <div className="w-8 h-8 bg-[#007AFF] rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg"
            title="ログイン"
          >
            <LogIn size={20} />
          </button>
          <button 
            onClick={() => setShowRegistrationModal(true)}
            className="p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors hover:bg-green-100 dark:hover:bg-green-900 rounded-lg"
            title="新規ユーザー登録"
          >
            <UserPlus size={20} />
          </button>
          <button 
            onClick={() => setShowInvitationModal(true)}
            className="p-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg"
            title="招待コードで登録"
          >
            <UserPlus size={20} />
          </button>
          <button 
            onClick={() => setShowResetModal(true)}
            className="p-2 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors hover:bg-orange-100 dark:hover:bg-orange-900 rounded-lg"
            title="学習進捗リセット"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={() => setShowProfileModal(true)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            title="プロフィール設定"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* ユーザープロフィールモーダル */}
      <UserProfileModal
        user={user}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSave={(updatedProfile) => {
          if (onUserUpdate) {
            onUserUpdate(updatedProfile);
          }
          setShowProfileModal(false);
        }}
      />

      {/* ユーザー登録モーダル */}
      <UserRegistration
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={() => {
          setShowRegistrationModal(false);
          // ページをリロードして新しいユーザー情報を反映
          window.location.reload();
        }}
      />

      {/* ログインモーダル */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          // ページをリロードしてログインしたユーザー情報を反映
          window.location.reload();
        }}
      />

      {/* 学習進捗リセットモーダル */}
      <ResetProgressModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onReset={() => {
          setShowResetModal(false);
          // ユーザーデータをリフレッシュ
          if (onRefreshUserData) {
            onRefreshUserData();
          }
        }}
      />

      {/* 招待コード登録モーダル */}
      {showInvitationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                招待コードで登録
              </h3>
              <button
                onClick={() => setShowInvitationModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            <InvitationRegistration
              onSuccess={(user) => {
                setShowInvitationModal(false);
                // ページをリロードして登録したユーザー情報を反映
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </header>
  );
}