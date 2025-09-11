// テストユーザー用のデモアカウントデータ
export const demoUsers = [
  {
    id: 'test_user_1',
    name: '田中 太郎',
    email: 'tanaka@test.com',
    password: 'test123',
    level: 1,
    birthYear: '1985',
    birthMonth: '3',
    birthDay: '15',
    prefecture: '東京都',
    hospital: '東京小児科病院',
    department: '小児科',
    experienceYears: '3',
    targetLevel: 5,
    specialty: '一般小児科',
    studyGoal: '小児科専門医取得',
    dailyGoal: 10,
    weeklyGoal: 50
  },
  {
    id: 'test_user_2',
    name: '佐藤 花子',
    email: 'sato@test.com',
    password: 'test123',
    level: 2,
    birthYear: '1990',
    birthMonth: '7',
    birthDay: '22',
    prefecture: '大阪府',
    hospital: '大阪小児科クリニック',
    department: '新生児科',
    experienceYears: '5',
    targetLevel: 6,
    specialty: '新生児・周産期',
    studyGoal: '新生児専門医取得',
    dailyGoal: 15,
    weeklyGoal: 75
  },
  {
    id: 'test_user_3',
    name: '鈴木 一郎',
    email: 'suzuki@test.com',
    password: 'test123',
    level: 1,
    birthYear: '1988',
    birthMonth: '11',
    birthDay: '8',
    prefecture: '神奈川県',
    hospital: '横浜小児病院',
    department: '循環器科',
    experienceYears: '4',
    targetLevel: 7,
    specialty: '循環器',
    studyGoal: '小児循環器専門医取得',
    dailyGoal: 20,
    weeklyGoal: 100
  },
  {
    id: 'test_user_4',
    name: '高橋 美咲',
    email: 'takahashi@test.com',
    password: 'test123',
    level: 3,
    birthYear: '1983',
    birthMonth: '5',
    birthDay: '12',
    prefecture: '愛知県',
    hospital: '名古屋小児科病院',
    department: '神経科',
    experienceYears: '8',
    targetLevel: 8,
    specialty: '神経',
    studyGoal: '小児神経専門医取得',
    dailyGoal: 25,
    weeklyGoal: 125
  },
  {
    id: 'test_user_5',
    name: '山田 健太',
    email: 'yamada@test.com',
    password: 'test123',
    level: 2,
    birthYear: '1992',
    birthMonth: '9',
    birthDay: '30',
    prefecture: '福岡県',
    hospital: '福岡小児科クリニック',
    department: '呼吸器科',
    experienceYears: '2',
    targetLevel: 4,
    specialty: '呼吸器',
    studyGoal: '小児呼吸器専門医取得',
    dailyGoal: 12,
    weeklyGoal: 60
  }
];

// テストユーザーをローカルストレージに登録する関数
export const registerDemoUsers = () => {
  try {
    // 既存の登録ユーザーを取得
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    console.log('既存の登録ユーザー:', existingUsers);
    
    // デモユーザーを追加（重複チェック）
    const newUsers = demoUsers.filter(demoUser => 
      !existingUsers.some(existing => existing.email === demoUser.email)
    );
    
    console.log('新規追加するユーザー:', newUsers);
    
    if (newUsers.length > 0) {
      const updatedUsers = [...existingUsers, ...newUsers];
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      console.log(`${newUsers.length}人のテストユーザーを登録しました`);
      console.log('更新後の登録ユーザー:', updatedUsers);
    } else {
      console.log('すべてのテストユーザーは既に登録済みです');
    }
    
    // すべてのテストユーザーの進捗をリセット（新規ユーザーは0からスタート）
    resetAllDemoUserProgress();
    
    return true;
  } catch (error) {
    console.error('テストユーザーの登録に失敗しました:', error);
    return false;
  }
};

// テストユーザーの進捗をリセットする関数
export const resetDemoUserProgress = (userId) => {
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
      lastLogin: null
    };
    localStorage.setItem('userProgress', JSON.stringify(allProgress));
    console.log(`ユーザー ${userId} の進捗をリセットしました`);
    return true;
  } catch (error) {
    console.error('進捗のリセットに失敗しました:', error);
    return false;
  }
};

// すべてのテストユーザーの進捗をリセットする関数
export const resetAllDemoUserProgress = () => {
  try {
    demoUsers.forEach(user => {
      resetDemoUserProgress(user.id);
    });
    console.log('すべてのテストユーザーの進捗をリセットしました');
    return true;
  } catch (error) {
    console.error('全ユーザーの進捗リセットに失敗しました:', error);
    return false;
  }
};
