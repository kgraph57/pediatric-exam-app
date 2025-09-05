# マルチステージビルド
FROM node:18-alpine AS builder

WORKDIR /app

# 依存関係のインストール（キャッシュを活用）
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund

# ソースコードのコピー
COPY . .

# ビルド（並列処理を有効化）
RUN npm run build

# 本番環境
FROM node:18-alpine AS runner

WORKDIR /app

# 本番用の依存関係のみインストール
COPY package*.json ./
RUN npm ci --only=production --no-audit --no-fund && npm cache clean --force

# ビルド結果をコピー
COPY --from=builder /app/build ./build
COPY --from=builder /app/__create ./__create

# ユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 権限を変更
RUN chown -R nextjs:nodejs /app
USER nextjs

# ポートを公開
EXPOSE 4000

# アプリケーションを起動
CMD ["npm", "start"]
