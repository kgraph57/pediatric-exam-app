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
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
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
