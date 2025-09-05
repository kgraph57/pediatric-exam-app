# デプロイメントガイド

## 🚀 Vercelでのデプロイ（推奨）

### 1. Vercelアカウントの作成
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインアップ
3. 無料プランで開始

### 2. プロジェクトのデプロイ
1. Vercelダッシュボードで「New Project」をクリック
2. GitHubリポジトリを選択
3. プロジェクト設定：
   - **Framework Preset**: Other
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3. 環境変数の設定
Vercelダッシュロードで以下の環境変数を設定：

```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database
AUTH_SECRET=your-secret-key-here
CORS_ORIGINS=https://your-app-name.vercel.app
```

### 4. データベースの設定
#### オプション1: Supabase（推奨・無料）
1. [Supabase](https://supabase.com)でアカウント作成
2. 新しいプロジェクトを作成
3. PostgreSQLデータベースが自動で作成される
4. 接続文字列をコピーしてVercelの環境変数に設定

#### オプション2: Neon（無料）
1. [Neon](https://neon.tech)でアカウント作成
2. 新しいデータベースを作成
3. 接続文字列をコピーしてVercelの環境変数に設定

### 5. デプロイの実行
1. 「Deploy」ボタンをクリック
2. ビルドが完了するまで待機（約2-3分）
3. デプロイ完了後、URLが表示される

## 📱 モバイル対応

### PWA（Progressive Web App）の設定
アプリケーションは既にPWA対応済みです：
- スマホのブラウザでアクセス
- 「ホーム画面に追加」でアプリのように使用可能
- オフラインでも一部機能が利用可能

## 🔧 その他のデプロイ方法

### Netlify
1. [Netlify](https://netlify.com)でアカウント作成
2. GitHubリポジトリを接続
3. ビルド設定を指定
4. 環境変数を設定

### Railway
1. [Railway](https://railway.app)でアカウント作成
2. GitHubリポジトリを接続
3. PostgreSQLデータベースを追加
4. 環境変数を設定

## 📊 運用・監視

### アクセス解析
- Vercelダッシュボードでアクセス数やパフォーマンスを確認
- 管理者ダッシュボードでユーザー活動を監視

### バックアップ
- 管理者ダッシュボードの「バックアップ管理」でデータをエクスポート
- 定期的なバックアップを推奨

## 🚨 トラブルシューティング

### よくある問題
1. **ビルドエラー**: 環境変数が正しく設定されているか確認
2. **データベース接続エラー**: DATABASE_URLが正しいか確認
3. **CORS エラー**: CORS_ORIGINSに正しいドメインを設定

### サポート
問題が発生した場合は、管理者ダッシュボードの「ヘルプ」セクションを確認してください。
