# 🚀 小児科試験アプリ 本番環境デプロイガイド

## 📋 概要

このガイドでは、小児科試験アプリを他の小児科医に1ヶ月間使用してもらうための本番環境デプロイ手順を説明します。

## 🛠️ 前提条件

- Node.js 18以上
- PostgreSQL データベース
- ドメイン（推奨）
- SSL証明書（推奨）

## 🚀 クイックスタート

### 1. アプリケーションの起動

```bash
# プロジェクトディレクトリに移動
cd apps/web

# 本番環境として起動
./start-production.sh
```

### 2. データベースの初期化

```bash
# PostgreSQLに接続してデータベースを初期化
psql -h localhost -U postgres -d pediatric_exam_app -f init-database.sql
```

### 3. アクセス確認

- アプリケーション: http://localhost:4000
- ヘルスチェック: http://localhost:4000/health

## 📊 新機能

### ✅ ユーザー管理機能
- 新規ユーザー登録
- プロフィール設定
- 学習目標設定

### ✅ 使用状況分析
- 管理者ダッシュボード
- ユーザー統計
- カテゴリ別使用状況
- 日別アクティビティ

## 🔧 環境設定

### 環境変数

```bash
NODE_ENV=production
PORT=4000
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=postgresql://user:password@localhost:5432/pediatric_exam_app
AUTH_SECRET=your-super-secret-auth-key-change-this-in-production
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### データベース設定

```sql
-- データベース作成
CREATE DATABASE pediatric_exam_app;

-- ユーザー作成
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE pediatric_exam_app TO app_user;
```

## 🌐 本番環境での運用

### 1. ドメイン設定

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    location / {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. SSL証明書の取得

```bash
# Let's Encryptを使用
sudo certbot --nginx -d your-domain.com
```

### 3. ファイアウォール設定

```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📈 監視とメンテナンス

### 1. ログの確認

```bash
# アプリケーションログ
tail -f /var/log/pediatric-exam-app.log

# システムログ
sudo journalctl -u pediatric-exam-app -f
```

### 2. パフォーマンス監視

```bash
# リソース使用量
htop

# ディスク使用量
df -h

# データベース接続数
psql -c "SELECT count(*) FROM pg_stat_activity;"
```

### 3. バックアップ

```bash
# データベースバックアップ
pg_dump pediatric_exam_app > backup_$(date +%Y%m%d).sql

# ファイルバックアップ
tar -czf app_backup_$(date +%Y%m%d).tar.gz /path/to/app
```

## 🔄 アップデート手順

```bash
# 最新のコードを取得
git pull origin main

# 依存関係を更新
npm install

# アプリケーションを再起動
pkill -f "npm run dev"
./start-production.sh
```

## 🚨 トラブルシューティング

### よくある問題

1. **ポートが既に使用されている**
   ```bash
   sudo lsof -i :4000
   sudo kill -9 <PID>
   ```

2. **データベース接続エラー**
   ```bash
   # データベースの状態確認
   sudo systemctl status postgresql
   ```

3. **メモリ不足**
   ```bash
   # メモリ使用量確認
   free -h
   ```

## 📞 サポート

### ユーザーサポート

- ユーザー登録: アプリ内の「新規登録」ボタン
- パスワードリセット: 管理者に連絡
- 技術的な問題: 管理者ダッシュボードで確認

### 管理者機能

- ユーザー管理: `/admin/users`
- 使用状況分析: `/admin/analytics`
- システム監視: `/admin/monitoring`

## 🔒 セキュリティチェックリスト

- [ ] 環境変数に機密情報が含まれていない
- [ ] 不要なポートが公開されていない
- [ ] SSL証明書が正しく設定されている
- [ ] ファイアウォールが適切に設定されている
- [ ] 定期的なセキュリティアップデートが行われている
- [ ] データベースのバックアップが定期的に実行されている

## 📱 モバイル対応

- レスポンシブデザイン対応済み
- PWA（Progressive Web App）機能
- オフライン学習機能（一部）

## 🎯 1ヶ月間の使用計画

### 第1週: 導入・設定
- ユーザー登録
- プロフィール設定
- 学習目標の設定

### 第2-3週: 本格使用
- 日常的な問題演習
- 進捗の確認
- 弱点の特定

### 第4週: 総括・分析
- 学習成果の確認
- 使用状況の分析
- フィードバックの収集

## 📊 期待される成果

- ユーザー数: 10-20名の小児科医
- 1日あたりの問題数: 平均15問
- 正解率の向上: 10-20%の改善
- 学習継続率: 80%以上
