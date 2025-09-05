// セキュリティミドルウェア

import { setSecurityHeaders, sanitizeInput, checkRateLimit } from '../utils/auth.js';

// セキュリティミドルウェア
export const securityMiddleware = (handler) => {
  return async (request, context) => {
    try {
      // セキュリティヘッダーを設定
      const response = await handler(request, context);
      return setSecurityHeaders(response);
    } catch (error) {
      console.error('Security middleware error:', error);
      
      // エラーレスポンスにもセキュリティヘッダーを設定
      const errorResponse = new Response(
        JSON.stringify({ message: 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
      
      return setSecurityHeaders(errorResponse);
    }
  };
};

// レート制限ミドルウェア
export const rateLimitMiddleware = (options = {}) => {
  const { limit = 10, windowMs = 60000 } = options;
  
  return (handler) => {
    return async (request, context) => {
      // クライアントIPアドレスを取得（簡易版）
      const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
      
      // レート制限をチェック
      if (!checkRateLimit(clientIP, limit, windowMs)) {
        return new Response(
          JSON.stringify({ 
            message: 'Too Many Requests',
            retryAfter: Math.ceil(windowMs / 1000)
          }),
          { 
            status: 429, 
            headers: { 
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil(windowMs / 1000).toString()
            } 
          }
        );
      }
      
      return handler(request, context);
    };
  };
};

// 認証ミドルウェア
export const authMiddleware = (handler) => {
  return async (request, context) => {
    // 認証が必要なエンドポイントかチェック
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // 認証が不要なエンドポイント
    const publicEndpoints = [
      '/api/users/register',
      '/api/users/login',
      '/api/users/demo',
      '/api/invitations/[code]'
    ];
    
    const isPublicEndpoint = publicEndpoints.some(endpoint => {
      if (endpoint.includes('[code]')) {
        return pathname.startsWith('/api/invitations/') && pathname.endsWith('/route.js');
      }
      return pathname === endpoint;
    });
    
    if (isPublicEndpoint) {
      return handler(request, context);
    }
    
    // 認証が必要なエンドポイント
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ message: '認証が必要です' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // 実際の実装では、JWTトークンの検証を行う
    // ここでは簡易的なチェックのみ
    
    return handler(request, context);
  };
};

// 入力検証ミドルウェア
export const validationMiddleware = (handler) => {
  return async (request, context) => {
    // POST/PUTリクエストの場合、リクエストボディを検証
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      try {
        const body = await request.json();
        
        // 入力値をサニタイズ
        const sanitizedBody = sanitizeRequestBody(body);
        
        // サニタイズされたボディで新しいリクエストを作成
        const sanitizedRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(sanitizedBody)
        });
        
        return handler(sanitizedRequest, context);
      } catch (error) {
        return new Response(
          JSON.stringify({ message: 'Invalid request body' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    return handler(request, context);
  };
};

// リクエストボディをサニタイズ
const sanitizeRequestBody = (body) => {
  if (typeof body !== 'object' || body === null) {
    return body;
  }
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(body)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeRequestBody(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// CORSミドルウェア
export const corsMiddleware = (handler) => {
  return async (request, context) => {
    const response = await handler(request, context);
    
    // CORSヘッダーを設定
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    // OPTIONSリクエストの処理
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }
    
    return response;
  };
};

// ログミドルウェア
export const loggingMiddleware = (handler) => {
  return async (request, context) => {
    const startTime = Date.now();
    const url = new URL(request.url);
    
    try {
      const response = await handler(request, context);
      const duration = Date.now() - startTime;
      
      console.log(`${request.method} ${url.pathname} - ${response.status} - ${duration}ms`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`${request.method} ${url.pathname} - ERROR - ${duration}ms`, error);
      
      throw error;
    }
  };
};
