# 🚀 本番環境デプロイガイド

## 📋 前提条件

- Node.js 18以上
- Docker & Docker Compose
- ドメイン（推奨）
- SSL証明書（推奨）

## 🛠️ ローカルでのビルドテスト

```bash
# 依存関係のインストール
npm install

# 本番用ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 🐳 Dockerでのデプロイ

### 1. 環境変数の設定

```bash
# .env.productionファイルを作成
cp .env.example .env.production

# 本番用の値を設定
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
DATABASE_URL=your_production_database_url
AUTH_SECRET=your_production_auth_secret
```

### 2. Dockerイメージのビルド

```bash
# イメージをビルド
docker build -t pediatric-exam-app .

# コンテナを起動
docker-compose up -d
```

### 3. 動作確認

```bash
# ログの確認
docker-compose logs -f web

# ヘルスチェック
curl http://localhost:4000/health
```

## 🌐 本番環境での運用

### 1. ドメインの設定

```bash
# Nginx設定例
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
# Let's Encryptを使用する場合
sudo certbot --nginx -d your-domain.com
```

### 3. ファイアウォールの設定

```bash
# UFWを使用する場合
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📊 監視とログ

### 1. ログの確認

```bash
# アプリケーションログ
docker-compose logs -f web

# システムログ
sudo journalctl -u docker.service -f
```

### 2. パフォーマンス監視

```bash
# リソース使用量の確認
docker stats

# ディスク使用量の確認
df -h
```

## 🔄 アップデート手順

```bash
# 最新のコードを取得
git pull origin main

# 新しいイメージをビルド
docker-compose build

# コンテナを再起動
docker-compose up -d

# 古いイメージを削除
docker image prune -f
```

## 🚨 トラブルシューティング

### よくある問題

1. **ポートが既に使用されている**
   ```bash
   sudo lsof -i :4000
   sudo kill -9 <PID>
   ```

2. **メモリ不足**
   ```bash
   # Dockerのメモリ制限を確認
   docker stats
   ```

3. **データベース接続エラー**
   ```bash
   # データベースの状態確認
   docker-compose logs database
   ```

## 📞 サポート

問題が発生した場合は、以下を確認してください：

1. ログファイルの内容
2. 環境変数の設定
3. ネットワーク設定
4. リソース使用量

## 🔒 セキュリティチェックリスト

- [ ] 環境変数に機密情報が含まれていない
- [ ] 不要なポートが公開されていない
- [ ] SSL証明書が正しく設定されている
- [ ] ファイアウォールが適切に設定されている
- [ ] 定期的なセキュリティアップデートが行われている
