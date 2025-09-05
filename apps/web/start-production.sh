#!/bin/bash

# 小児科試験アプリ本番環境起動スクリプト

echo "🚀 小児科試験アプリを起動中..."

# 既存のプロセスを停止
echo "📋 既存のプロセスを停止中..."
pkill -f "npm run dev" || true

# 依存関係をインストール（必要に応じて）
echo "📦 依存関係を確認中..."
npm install --production

# 本番環境として起動
echo "🌟 本番環境として起動中..."
NODE_ENV=production npm run dev

echo "✅ アプリケーションが起動しました！"
echo "🌐 アクセスURL: http://localhost:4000"
echo "📱 モバイル対応: はい"
echo "🔒 セキュリティ: 基本設定済み"
