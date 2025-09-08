// 学習進捗管理ユーティリティ

// ユーザーごとの学習進捗を取得
export const getUserProgress = (userId) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    return allProgress[userId] || {
      studyProgress: {},
      favoriteIds: [],
      incorrectIds: [],
      categoryStats: {},
      totalAnswered: 0,
      totalCorrect: 0,
      currentStreak: 0,
      totalStudyTime: 0,
      lastLogin: null
    };
  } catch (error) {
    console.error('Failed to get user progress:', error);
    return {
      studyProgress: {},
      favoriteIds: [],
      incorrectIds: [],
      categoryStats: {},
      totalAnswered: 0,
      totalCorrect: 0,
      currentStreak: 0,
      totalStudyTime: 0,
      lastLogin: null
    };
  }
};

// ユーザーごとの学習進捗を保存
export const saveUserProgress = (userId, progressData) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    allProgress[userId] = {
      ...progressData,
      lastLogin: new Date().toISOString()
    };
    localStorage.setItem('userProgress', JSON.stringify(allProgress));
  } catch (error) {
    console.error('Failed to save user progress:', error);
  }
};

// ユーザーの学習進捗をリセット
export const resetUserProgress = (userId) => {
  try {
    const allProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    allProgress[userId] = {
      studyProgress: {},
      favoriteIds: [],
      incorrectIds: [],
      categoryStats: {},
      totalAnswered: 0,
      totalCorrect: 0,
      currentStreak: 0,
      totalStudyTime: 0,
      lastLogin: new Date().toISOString()
    };
    localStorage.setItem('userProgress', JSON.stringify(allProgress));
    
    // 現在のセッションの進捗もクリア
    localStorage.setItem('studyProgress', JSON.stringify({}));
    localStorage.setItem('favoriteQuestionIds', JSON.stringify([]));
    localStorage.setItem('incorrectQuestionIds', JSON.stringify([]));
    
    // 現在のユーザーの統計もリセット
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id === userId) {
      const resetUser = {
        ...currentUser,
        totalAnswered: 0,
        totalCorrect: 0,
        streak: 0,
        longestStreak: 0,
        categoryStats: []
      };
      localStorage.setItem('currentUser', JSON.stringify(resetUser));
    }
    
    console.log('User progress reset successfully for:', userId);
  } catch (error) {
    console.error('Failed to reset user progress:', error);
  }
};

// ユーザーの学習進捗を現在のセッションに適用
export const applyUserProgress = (userId) => {
  try {
    const userProgress = getUserProgress(userId);
    
    // 学習進捗を適用
    localStorage.setItem('studyProgress', JSON.stringify(userProgress.studyProgress));
    localStorage.setItem('favoriteQuestionIds', JSON.stringify(userProgress.favoriteIds));
    localStorage.setItem('incorrectQuestionIds', JSON.stringify(userProgress.incorrectIds));
    
    return userProgress;
  } catch (error) {
    console.error('Failed to apply user progress:', error);
    return null;
  }
};

// 現在のセッションの進捗をユーザーに保存
export const saveCurrentSessionProgress = (userId) => {
  try {
    const studyProgress = JSON.parse(localStorage.getItem('studyProgress') || '{}');
    const favoriteIds = JSON.parse(localStorage.getItem('favoriteQuestionIds') || '[]');
    const incorrectIds = JSON.parse(localStorage.getItem('incorrectQuestionIds') || '[]');
    
    saveUserProgress(userId, {
      studyProgress,
      favoriteIds,
      incorrectIds,
      categoryStats: calculateCategoryStats(studyProgress)
    });
  } catch (error) {
    console.error('Failed to save current session progress:', error);
  }
};

// カテゴリ別統計を計算
export const calculateCategoryStats = (studyProgress) => {
  const stats = {};
  
  Object.keys(studyProgress).forEach(category => {
    const questions = studyProgress[category];
    const totalQuestions = Object.keys(questions).length;
    const correctAnswers = Object.values(questions).filter(q => q.isCorrect).length;
    
    stats[category] = {
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      completed: totalQuestions,
      lastUpdated: new Date().toISOString()
    };
  });
  
  return stats;
};

// デモユーザーの初期データを生成
export const generateDemoProgress = (userId) => {
  const categories = ['循環器', '呼吸器', '消化器', '神経', '内分泌・代謝', '血液・腫瘍', '免疫・アレルギー', '救急', '新生児・周産期', '一般'];
  const demoProgress = {};
  
  categories.forEach(category => {
    demoProgress[category] = {};
    // 各カテゴリでランダムに10-30問の進捗を生成
    const questionCount = Math.floor(Math.random() * 21) + 10;
    
    for (let i = 0; i < questionCount; i++) {
      const questionId = `${category}_${i}`;
      demoProgress[category][questionId] = {
        isCorrect: Math.random() > 0.3, // 70%の正解率
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // 過去30日以内
        attempts: Math.floor(Math.random() * 3) + 1
      };
    }
  });
  
  return {
    studyProgress: demoProgress,
    favoriteIds: [],
    incorrectIds: [],
    categoryStats: calculateCategoryStats(demoProgress),
    lastLogin: new Date().toISOString()
  };
};

// 新規ユーザーの初期データを生成
export const generateNewUserProgress = () => {
  return {
    studyProgress: {},
    favoriteIds: [],
    incorrectIds: [],
    categoryStats: {},
    lastLogin: new Date().toISOString()
  };
};
