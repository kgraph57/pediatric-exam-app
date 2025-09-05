// 認証・認可ユーティリティ関数

// 管理者権限をチェック
export const isAdmin = (user) => {
  if (!user) return false;
  
  // デモユーザーは管理者として扱う
  if (user.id === 'demo') return true;
  
  // 実際の実装では、ユーザーのroleやpermissionsをチェック
  return user.role === 'admin' || user.isAdmin === true;
};

// 管理者ページへのアクセス権限をチェック
export const canAccessAdmin = (user) => {
  return isAdmin(user);
};

// ユーザー登録権限をチェック
export const canRegister = (user) => {
  // 現在は誰でも登録可能
  return true;
};

// 招待コードの使用権限をチェック
export const canUseInvitation = (invitationCode) => {
  // 招待コードの有効性をチェック
  // 実際の実装では、データベースで招待コードの存在と有効性を確認
  return true;
};

// セッションの有効性をチェック
export const isSessionValid = (user) => {
  if (!user) return false;
  
  // セッションの有効期限をチェック
  const lastLogin = new Date(user.lastLogin || user.createdAt);
  const now = new Date();
  const diffInHours = (now - lastLogin) / (1000 * 60 * 60);
  
  // 24時間以内のログインを有効とする
  return diffInHours < 24;
};

// ユーザーのアクセス権限をチェック
export const hasPermission = (user, permission) => {
  if (!user) return false;
  
  const permissions = {
    'read:users': isAdmin(user),
    'write:users': isAdmin(user),
    'delete:users': isAdmin(user),
    'read:logs': isAdmin(user),
    'write:logs': true, // ログ記録は全ユーザーが可能
    'read:analytics': isAdmin(user),
    'write:notifications': isAdmin(user),
    'read:notifications': isAdmin(user),
    'write:backups': isAdmin(user),
    'read:backups': isAdmin(user),
    'restore:backups': isAdmin(user),
    'export:data': isAdmin(user),
    'practice:questions': true, // 問題演習は全ユーザーが可能
    'update:profile': true, // プロフィール更新は全ユーザーが可能
    'reset:progress': true // 進捗リセットは全ユーザーが可能
  };
  
  return permissions[permission] || false;
};

// APIエンドポイントのアクセス権限をチェック
export const checkApiPermission = (user, endpoint, method) => {
  const permissionMap = {
    'GET /api/users/list': 'read:users',
    'GET /api/users/[id]': 'read:users',
    'PUT /api/users/[id]': 'write:users',
    'DELETE /api/users/[id]': 'delete:users',
    'GET /api/logs': 'read:logs',
    'POST /api/logs': 'write:logs',
    'GET /api/admin/analytics': 'read:analytics',
    'GET /api/notifications': 'read:notifications',
    'POST /api/notifications': 'write:notifications',
    'GET /api/backup': 'read:backups',
    'POST /api/backup': 'write:backups',
    'POST /api/backup/[id]/restore': 'restore:backups',
    'GET /api/export': 'export:data'
  };
  
  const key = `${method} ${endpoint}`;
  const permission = permissionMap[key];
  
  if (!permission) {
    // 権限マップにないエンドポイントは許可
    return true;
  }
  
  return hasPermission(user, permission);
};

// セキュリティヘッダーを設定
export const setSecurityHeaders = (response) => {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
};

// 入力値のサニタイズ
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // HTMLタグを除去
    .replace(/javascript:/gi, '') // JavaScriptプロトコルを除去
    .replace(/on\w+=/gi, '') // イベントハンドラーを除去
    .trim();
};

// パスワードの強度をチェック
export const validatePassword = (password) => {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength,
    strength: {
      length: password.length >= minLength,
      uppercase: hasUpperCase,
      lowercase: hasLowerCase,
      numbers: hasNumbers,
      specialChar: hasSpecialChar
    },
    score: [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    ].filter(Boolean).length
  };
};

// レート制限のチェック（簡易版）
export const checkRateLimit = (identifier, limit = 10, windowMs = 60000) => {
  const key = `rate_limit_${identifier}`;
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // ローカルストレージからレート制限データを取得
  const rateLimitData = JSON.parse(localStorage.getItem(key) || '[]');
  
  // ウィンドウ外のデータを削除
  const validRequests = rateLimitData.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= limit) {
    return false; // レート制限に達している
  }
  
  // 新しいリクエストを記録
  validRequests.push(now);
  localStorage.setItem(key, JSON.stringify(validRequests));
  
  return true; // レート制限内
};
