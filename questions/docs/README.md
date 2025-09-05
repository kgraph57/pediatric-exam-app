# 小児科専門医対策 問題管理システム

## 📁 フォルダ構造

```
questions/
├── categories/          # 分野別問題
│   ├── digestive/      # 消化器
│   ├── respiratory/    # 呼吸器
│   ├── cardiovascular/ # 循環器
│   ├── neurology/      # 神経
│   ├── endocrinology/  # 内分泌
│   ├── hematology/     # 血液
│   ├── immunology/     # 免疫
│   ├── neonatology/    # 新生児
│   ├── emergency/      # 救急
│   └── general/        # 一般
├── difficulties/        # 難易度別問題
│   ├── basic/          # 基礎
│   ├── intermediate/   # 中級
│   ├── advanced/       # 上級
│   └── expert/         # 専門
├── versions/           # 年度別問題
│   ├── 2024/
│   ├── 2025/
│   ├── 2026/
│   └── 2027/
├── templates/          # 問題テンプレート
├── scripts/            # 管理用スクリプト
├── docs/              # このドキュメント
├── imports/            # 外部からの問題インポート
├── exports/            # 問題のエクスポート
└── backups/            # 問題データのバックアップ
```

## 🆕 新しい問題の作成方法

### 1. テンプレートの使用
```bash
cp questions/templates/question_template.json questions/categories/digestive/new_question.json
```

### 2. 問題の分類
- **分野**: `categories/` 内の適切なフォルダに配置
- **難易度**: `difficulties/` 内の適切なフォルダに配置
- **年度**: `versions/` 内の適切なフォルダに配置

### 3. ファイル命名規則
```
{分野}_{難易度}_{年度}_{連番}.json
例: digestive_basic_2026_001.json
```

## 🔧 管理スクリプト

### 問題の一括変換
```bash
node questions/scripts/convert_questions.js
```

### 問題の検証
```bash
node questions/scripts/validate_questions.js
```

### 問題の統合
```bash
node questions/scripts/merge_questions.js
```

## 📊 問題のステータス

- `draft`: 作成中
- `review`: レビュー中
- `approved`: 承認済み
- `published`: 公開済み

## 🏷️ タグシステム

問題にタグを付けることで、より細かい分類が可能です：
- 疾患名: `diabetes`, `asthma`, `leukemia`
- 年齢層: `neonatal`, `infant`, `adolescent`
- 検査: `imaging`, `lab`, `physical`
- 治療: `medical`, `surgical`, `supportive`

## 📝 問題作成のベストプラクティス

1. **問題文**: 選択肢を含めない、明確で簡潔な文章
2. **選択肢**: 5つの選択肢、1つが正解
3. **解説**: 各選択肢について詳しい説明
4. **学習ポイント**: 重要な概念を3-5個
5. **参考文献**: 信頼できる情報源を明記

## 🔄 更新履歴

- 2026-01-01: システム初期化
- 2026-01-01: テンプレート作成
- 2026-01-01: ドキュメント作成
