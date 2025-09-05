// ログ記録用のユーティリティ関数

// ログを記録する関数
export const logAction = async (action, details = {}, userId = null) => {
  try {
    // 現在のユーザーIDを取得
    if (!userId) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      userId = currentUser.id;
    }

    if (!userId) {
      console.warn('No user ID available for logging');
      return;
    }

    // IPアドレスとユーザーエージェントを取得
    const logData = {
      userId,
      action,
      details,
      ipAddress: 'unknown', // クライアントサイドでは正確なIPアドレスは取得できない
      userAgent: navigator.userAgent
    };

    // ログを送信
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      console.error('Failed to log action:', action);
    }
  } catch (error) {
    console.error('Error logging action:', error);
  }
};

// よく使用されるアクションのログ関数
export const logLogin = (userId, details = {}) => {
  return logAction('login', { ...details, timestamp: new Date().toISOString() }, userId);
};

export const logLogout = (userId, details = {}) => {
  return logAction('logout', { ...details, timestamp: new Date().toISOString() }, userId);
};

export const logRegister = (userId, details = {}) => {
  return logAction('register', { ...details, timestamp: new Date().toISOString() }, userId);
};

export const logPracticeStart = (userId, category, details = {}) => {
  return logAction('practice_start', { 
    category, 
    ...details, 
    timestamp: new Date().toISOString() 
  }, userId);
};

export const logPracticeAnswer = (userId, questionId, isCorrect, details = {}) => {
  return logAction('practice_answer', { 
    questionId, 
    isCorrect, 
    ...details, 
    timestamp: new Date().toISOString() 
  }, userId);
};

export const logPracticeComplete = (userId, category, score, details = {}) => {
  return logAction('practice_complete', { 
    category, 
    score, 
    ...details, 
    timestamp: new Date().toISOString() 
  }, userId);
};

export const logProfileUpdate = (userId, updatedFields, details = {}) => {
  return logAction('profile_update', { 
    updatedFields, 
    ...details, 
    timestamp: new Date().toISOString() 
  }, userId);
};

export const logProgressReset = (userId, details = {}) => {
  return logAction('progress_reset', { 
    ...details, 
    timestamp: new Date().toISOString() 
  }, userId);
};

export const logInvitationUse = (userId, invitationCode, details = {}) => {
  return logAction('invitation_use', { 
    invitationCode, 
    ...details, 
    timestamp: new Date().toISOString() 
  }, userId);
};

export const logPageView = (userId, page, details = {}) => {
  return logAction('page_view', { 
    page, 
    ...details, 
    timestamp: new Date().toISOString() 
  }, userId);
};

export const logError = (userId, error, details = {}) => {
  return logAction('error', { 
    error: error.message || error, 
    stack: error.stack,
    ...details, 
    timestamp: new Date().toISOString() 
  }, userId);
};
