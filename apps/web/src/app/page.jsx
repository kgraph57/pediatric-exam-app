import { useState, useEffect } from "react";
import { Header } from "../components/Header/Header";
import { DashboardSection } from "../components/Dashboard/DashboardSection";
import { PracticeSection } from "../components/Practice/PracticeSection";
import { AISection } from "../components/AI/AISection";
import { ProgressSection } from "../components/Progress/ProgressSection";
import { AnalyticsDashboard } from "../components/Admin/AnalyticsDashboard";
import { HelpCenter } from "../components/Support/HelpCenter";
import { Navigation } from "../components/Navigation/Navigation";
import { getUserProgress, applyUserProgress } from "../utils/progressManager";
import { registerDemoUsers } from "../data/demoUsers";

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [demoUser, setDemoUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [practiceSessionKey, setPracticeSessionKey] = useState(0);

  // ユーザー情報を更新する関数
  const handleUserUpdate = async (updatedProfile) => {
    try {
      // 実際の実装では、APIを呼び出してユーザー情報を更新
      const response = await fetch(`/api/users/${demoUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (response.ok) {
        // ローカル状態を更新
        setDemoUser(prev => ({
          ...prev,
          ...updatedProfile,
          level: updatedProfile.currentLevel, // レベルを同期
        }));
      } else {
        console.error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      // エラーが発生した場合でも、ローカル状態を更新（デモ用）
      setDemoUser(prev => ({
        ...prev,
        ...updatedProfile,
        level: updatedProfile.currentLevel,
      }));
    }
  };

  // ログアウト機能
  const handleLogout = () => {
    setDemoUser(null);
    localStorage.removeItem('currentUser');
    setActiveSection('dashboard');
  };

  // ユーザー情報をリフレッシュする関数
  const refreshUserData = () => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // ユーザーの進捗を適用
      if (userData.id) {
        applyUserProgress(userData.id);
      }
      
      setDemoUser({
        ...userData,
        total_answered: userData.totalAnswered || 0,
        total_correct: userData.totalCorrect || 0,
        streak: userData.streak || 0,
        longest_streak: userData.longestStreak || 0,
        birthYear: userData.birthYear || '1990',
        birthMonth: userData.birthMonth || '4',
        birthDay: userData.birthDay || '15',
        prefecture: userData.prefecture || '東京都',
        hospital: userData.hospital || '',
        department: userData.department || '',
        experienceYears: userData.experienceYears || '',
        targetLevel: userData.targetLevel || 5,
        specialty: userData.specialty || '',
        studyGoal: userData.studyGoal || '',
        dailyGoal: userData.dailyGoal || 15,
        weeklyGoal: userData.weeklyGoal || 80,
        studyTime: userData.studyTime || 'evening',
        studyFrequency: userData.studyFrequency || 'daily',
        categoryStats: userData.categoryStats || []
      });
    }
  };

  // Initialize user with data from localStorage or database
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // テストユーザーを自動登録
        registerDemoUsers();
        
        // まずローカルストレージからユーザー情報を確認
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          
          // ユーザーの進捗を適用
          if (userData.id) {
            applyUserProgress(userData.id);
          }
          
          // デフォルト値を追加
          setDemoUser({
            ...userData,
            total_answered: userData.totalAnswered || 0,
            total_correct: userData.totalCorrect || 0,
            streak: userData.streak || 0,
            longest_streak: userData.longestStreak || 0,
            birthYear: userData.birthYear || '1990',
            birthMonth: userData.birthMonth || '4',
            birthDay: userData.birthDay || '15',
            prefecture: userData.prefecture || '東京都',
            hospital: userData.hospital || '',
            department: userData.department || '',
            experienceYears: userData.experienceYears || '',
            targetLevel: userData.targetLevel || 5,
            specialty: userData.specialty || '',
            studyGoal: userData.studyGoal || '',
            dailyGoal: userData.dailyGoal || 15,
            weeklyGoal: userData.weeklyGoal || 80,
            studyTime: userData.studyTime || 'evening',
            studyFrequency: userData.studyFrequency || 'daily',
            categoryStats: userData.categoryStats || []
          });
          return;
        }

        // ローカルストレージにない場合はデモユーザーを取得
        const response = await fetch("/api/users/demo");
        if (response.ok) {
          const userData = await response.json();
          setDemoUser(userData);
        } else {
          // Fallback demo user
          setDemoUser({
            id: "demo",
            name: "デモユーザー",
            level: 1,
            total_answered: 0,
            total_correct: 0,
            streak: 0,
          });
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        // Fallback demo user
        setDemoUser({
          id: "demo",
          name: "デモユーザー",
          level: 3,
          total_answered: 0,
          total_correct: 0,
          streak: 0,
          birthYear: '1990',
          birthMonth: '4',
          birthDay: '15',
          prefecture: '東京都',
          hospital: '東京小児科病院',
          department: '小児科',
          experienceYears: '5',
          targetLevel: 7,
          specialty: '循環器',
          studyGoal: '小児科専門医取得',
          dailyGoal: 15,
          weeklyGoal: 80
        });
      }
    };

    initializeUser();
  }, []);

  // ログイン画面を開くためのイベントリスナー
  useEffect(() => {
    const handleOpenLoginModal = () => {
      // ログイン画面を開く処理（Headerコンポーネントで実装）
      const event = new CustomEvent('showLoginModal');
      window.dispatchEvent(event);
    };

    const handleOpenRegistrationModal = () => {
      // 登録画面を開く処理（Headerコンポーネントで実装）
      const event = new CustomEvent('showRegistrationModal');
      window.dispatchEvent(event);
    };

    window.addEventListener('openLoginModal', handleOpenLoginModal);
    window.addEventListener('openRegistrationModal', handleOpenRegistrationModal);

    return () => {
      window.removeEventListener('openLoginModal', handleOpenLoginModal);
      window.removeEventListener('openRegistrationModal', handleOpenRegistrationModal);
    };
  }, []);

  const renderActiveSection = () => {
    if (!demoUser) return null;

    switch (activeSection) {
      case "dashboard":
        return <DashboardSection user={demoUser} onSectionChange={setActiveSection} />;
      case "practice":
        return <PracticeSection key={practiceSessionKey} user={demoUser} onToggleSidebar={() => setIsSidebarOpen(false)} />;
      case "ai":
        return <AISection user={demoUser} />;
      case "progress":
        return <ProgressSection user={demoUser} />;
      case "admin":
        return <AnalyticsDashboard />;
      case "help":
        return <HelpCenter />;
      default:
        return <DashboardSection user={demoUser} onSectionChange={setActiveSection} />;
    }
  };

  if (!demoUser) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              小児科医国家試験アプリ
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              ログインして学習を開始しましょう
            </p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => {
                const event = new CustomEvent('openLoginModal');
                window.dispatchEvent(event);
              }}
              className="w-full bg-[#007AFF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0056CC] transition-colors"
            >
              ログイン
            </button>
            
            <button
              onClick={() => {
                const event = new CustomEvent('openRegistrationModal');
                window.dispatchEvent(event);
              }}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              新規ユーザー登録
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
              テストユーザーアカウント
            </h3>
            <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <p>メール: tanaka@test.com</p>
              <p>パスワード: test123</p>
              <p className="text-blue-600 dark:text-blue-400">
                その他のテストアカウントも利用可能
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#121212]">
      <Header
        user={demoUser}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onHomeClick={() => {
          setActiveSection('dashboard');
        }}
        onUserUpdate={handleUserUpdate}
        onRefreshUserData={refreshUserData}
        onLogout={handleLogout}
      />
      <div className="flex">
        <Navigation
          activeSection={activeSection}
          onSectionChange={(section) => {
            if (section === 'practice') {
              // Practiceへ遷移するたびにセッションをリセット
              setPracticeSessionKey((k) => k + 1);
            }
            setActiveSection(section);
          }}
          isSidebarOpen={isSidebarOpen}
        />
        <main className={`flex-1 pt-16 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}`}>{renderActiveSection()}</main>
      </div>
    </div>
  );
}
