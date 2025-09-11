// 学習履歴管理ユーティリティ

// 学習セッションを保存
export const saveLearningSession = (userId, sessionData) => {
  try {
    const allSessions = JSON.parse(localStorage.getItem('learningSessions') || '{}');
    if (!allSessions[userId]) {
      allSessions[userId] = [];
    }
    
    const session = {
      id: `session_${Date.now()}`,
      userId,
      timestamp: new Date().toISOString(),
      ...sessionData
    };
    
    allSessions[userId].push(session);
    localStorage.setItem('learningSessions', JSON.stringify(allSessions));
    
    console.log('学習セッションを保存しました:', session);
    return session;
  } catch (error) {
    console.error('学習セッションの保存に失敗しました:', error);
    return null;
  }
};

// ユーザーの学習セッションを取得
export const getUserLearningSessions = (userId) => {
  try {
    const allSessions = JSON.parse(localStorage.getItem('learningSessions') || '{}');
    return allSessions[userId] || [];
  } catch (error) {
    console.error('学習セッションの取得に失敗しました:', error);
    return [];
  }
};

// 問題の解答履歴を保存
export const saveQuestionAnswer = (userId, questionId, answerData) => {
  try {
    const allAnswers = JSON.parse(localStorage.getItem('questionAnswers') || '{}');
    if (!allAnswers[userId]) {
      allAnswers[userId] = {};
    }
    
    const answer = {
      questionId,
      userId,
      timestamp: new Date().toISOString(),
      ...answerData
    };
    
    allAnswers[userId][questionId] = answer;
    localStorage.setItem('questionAnswers', JSON.stringify(allAnswers));
    
    console.log('問題解答を保存しました:', answer);
    return answer;
  } catch (error) {
    console.error('問題解答の保存に失敗しました:', error);
    return null;
  }
};

// ユーザーの問題解答履歴を取得
export const getUserQuestionAnswers = (userId) => {
  try {
    const allAnswers = JSON.parse(localStorage.getItem('questionAnswers') || '{}');
    return allAnswers[userId] || {};
  } catch (error) {
    console.error('問題解答履歴の取得に失敗しました:', error);
    return {};
  }
};

// 未解答の問題を取得
export const getUnansweredQuestions = (userId, questions) => {
  try {
    const answeredQuestions = getUserQuestionAnswers(userId);
    const answeredIds = Object.keys(answeredQuestions);
    
    return questions.filter(question => !answeredIds.includes(question.id));
  } catch (error) {
    console.error('未解答問題の取得に失敗しました:', error);
    return questions;
  }
};

// 間違った問題を取得
export const getIncorrectQuestions = (userId, questions) => {
  try {
    const answeredQuestions = getUserQuestionAnswers(userId);
    const incorrectIds = Object.keys(answeredQuestions).filter(
      questionId => answeredQuestions[questionId].isCorrect === false
    );
    
    return questions.filter(question => incorrectIds.includes(question.id));
  } catch (error) {
    console.error('間違った問題の取得に失敗しました:', error);
    return [];
  }
};

// 正解した問題を取得
export const getCorrectQuestions = (userId, questions) => {
  try {
    const answeredQuestions = getUserQuestionAnswers(userId);
    const correctIds = Object.keys(answeredQuestions).filter(
      questionId => answeredQuestions[questionId].isCorrect === true
    );
    
    return questions.filter(question => correctIds.includes(question.id));
  } catch (error) {
    console.error('正解問題の取得に失敗しました:', error);
    return [];
  }
};

// 学習統計を計算
export const calculateLearningStats = (userId) => {
  try {
    const answeredQuestions = getUserQuestionAnswers(userId);
    const sessions = getUserLearningSessions(userId);
    
    const totalAnswered = Object.keys(answeredQuestions).length;
    const totalCorrect = Object.values(answeredQuestions).filter(
      answer => answer.isCorrect
    ).length;
    
    const accuracy = totalAnswered > 0 ? (totalCorrect / totalAnswered) * 100 : 0;
    
    const totalStudyTime = sessions.reduce((total, session) => 
      total + (session.timeSpent || 0), 0
    );
    
    const studyDays = new Set(
      sessions.map(session => 
        new Date(session.timestamp).toDateString()
      )
    ).size;
    
    return {
      totalAnswered,
      totalCorrect,
      totalIncorrect: totalAnswered - totalCorrect,
      accuracy: Math.round(accuracy * 100) / 100,
      totalStudyTime,
      studyDays,
      totalSessions: sessions.length
    };
  } catch (error) {
    console.error('学習統計の計算に失敗しました:', error);
    return {
      totalAnswered: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      accuracy: 0,
      totalStudyTime: 0,
      studyDays: 0,
      totalSessions: 0
    };
  }
};

// カテゴリ別の学習統計を計算
export const calculateCategoryStats = (userId, questions) => {
  try {
    const answeredQuestions = getUserQuestionAnswers(userId);
    const categoryStats = {};
    
    // 各カテゴリの統計を初期化
    const categories = [...new Set(questions.map(q => q.category))];
    categories.forEach(category => {
      categoryStats[category] = {
        total: 0,
        answered: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0
      };
    });
    
    // 問題の総数をカウント
    questions.forEach(question => {
      categoryStats[question.category].total++;
    });
    
    // 解答済み問題の統計を計算
    Object.values(answeredQuestions).forEach(answer => {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        const category = question.category;
        categoryStats[category].answered++;
        if (answer.isCorrect) {
          categoryStats[category].correct++;
        } else {
          categoryStats[category].incorrect++;
        }
      }
    });
    
    // 正解率を計算
    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.accuracy = stats.answered > 0 ? 
        Math.round((stats.correct / stats.answered) * 100 * 100) / 100 : 0;
    });
    
    return categoryStats;
  } catch (error) {
    console.error('カテゴリ統計の計算に失敗しました:', error);
    return {};
  }
};

// 学習履歴をリセット
export const resetLearningHistory = (userId) => {
  try {
    const allSessions = JSON.parse(localStorage.getItem('learningSessions') || '{}');
    const allAnswers = JSON.parse(localStorage.getItem('questionAnswers') || '{}');
    
    delete allSessions[userId];
    delete allAnswers[userId];
    
    localStorage.setItem('learningSessions', JSON.stringify(allSessions));
    localStorage.setItem('questionAnswers', JSON.stringify(allAnswers));
    
    console.log(`ユーザー ${userId} の学習履歴をリセットしました`);
    return true;
  } catch (error) {
    console.error('学習履歴のリセットに失敗しました:', error);
    return false;
  }
};
