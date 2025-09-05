### 小児科試験アプリ 問題データ提供 指示書 v1.0

このドキュメントは、外部アプリ・外部チームが本アプリに取り込む問題データを作成する際の仕様です。

---

### 提出形式（推奨/代替）
- **推奨**: JSONL（UTF-8、1行=1問）
- **代替**: CSV/スプレッドシート（所定カラム）

テンプレート:
- JSONL: `apps/web/src/data/peds_questions_template.jsonl`
- CSV: `apps/web/src/data/peds_questions_template.csv`

---

### 問題タイプと選択肢
- `SBA`: 単一選択（正解は1つ）
- `MBA`: 複数選択（正解は2つ以上、基本2つ）
- 選択肢数: 原則5（A〜E）

---

### JSONL スキーマ
1行ごとに以下のJSONオブジェクトを記述します。

必須フィールド:
- `type`: "SBA" | "MBA"
- `category`: 既定カテゴリ名（下記一覧参照）
- `difficulty`: "初学者レベル" | "標準レベル" | "専門医レベル"
- `question`: 設問本文（300〜800字目安）
- `options`: 文字列配列（5件）
- `correctAnswer`: SBAは数値0〜4、MBAは数値配列（例: [0,4]）
- `explanation`: 文字列配列（5件、各選択肢の理由。「◯/×」の明示推奨）
- `keyLearningPoints`: 2〜5件の配列（短文）
- `references`: 1〜3件の配列（ガイドライン/教科書等）

任意フィールド:
- `id`: 数値（未指定可。未指定時は取り込み側で採番）
- `tags`: 文字列配列
- `sourceId`: 文字列（出典や外部管理ID）
- `media`: 画像等の付随情報 `{ type: "image", url: "…", alt: "…" }`

例:
```json
{"id":101,"type":"SBA","category":"内分泌・代謝","difficulty":"専門医レベル","question":"症例文…最も適切な対応はどれか。","options":["A案","B案","C案","D案","E案"],"correctAnswer":2,"explanation":["× Aの理由…","× Bの理由…","◯ Cの理由…","× Dの理由…","× Eの理由…"],"keyLearningPoints":["ポイント1","ポイント2","ポイント3"],"references":["日本○○学会ガイドライン2023"]}
{"id":202,"type":"MBA","category":"循環器","difficulty":"標準レベル","question":"症例文…正しいものを2つ選べ。","options":["A案","B案","C案","D案","E案"],"correctAnswer":[0,4],"explanation":["◯ Aの理由…","× Bの理由…","× Cの理由…","× Dの理由…","◯ Eの理由…"],"keyLearningPoints":["ポイント1","ポイント2"],"references":["ESC Pediatric Guidelines 2021"]}
```

---

### CSV/スプレッドシート 仕様
ヘッダは固定とし、以下の列を使用します。

必須:
`type,category,difficulty,question,option_A,option_B,option_C,option_D,option_E,correct`

任意:
`explain_A,explain_B,explain_C,explain_D,explain_E,key_points,references`

値ルール:
- SBAの`correct`は0〜4（A=0…E=4）
- MBAの`correct`は `0|4` のように`|`区切り
- `key_points`/`references` は `|` 区切りで複数記述可

例:
```csv
type,category,difficulty,question,option_A,option_B,option_C,option_D,option_E,correct,explain_A,explain_B,explain_C,explain_D,explain_E,key_points,references
SBA,内分泌・代謝,専門医レベル,症例文…最も適切は？,A案,B案,C案,D案,E案,2,×Aの理由,×Bの理由,◯Cの理由,×Dの理由,×Eの理由,"ポイント1|ポイント2","日本○○学会2023|ESC 2021"
MBA,循環器,標準レベル,症例文…正しいものを2つ選べ。,A案,B案,C案,D案,E案,"0|4",◯Aの理由,×Bの理由,×Cの理由,×Dの理由,◯Eの理由,"ポイント1|ポイント2","参考1"
```

---

### カテゴリ一覧（固定）
- 新生児・周産期 / 循環器 / 内分泌・代謝 / 感染症・免疫 / 神経・発達
- 血液・腫瘍 / 腎泌尿器 / 呼吸器 / 消化器 / アレルギー

---

### 作問ガイドライン（抜粋）
- 設問は臨床状況→問いの順。否定形・二重否定を避ける。
- 選択肢は長さ・構文を揃える。極端表現（常に/決して）は避ける。
- 根拠は`explanation`に病態生理/ガイドライン根拠を簡潔に記載。
- 日本語、数字は半角、不要な長小数は避ける。単位は国際表記。

---

### 納品・運用
- ファイル名: `peds_questions_YYYYMMDD.jsonl`（推奨）または `.csv`
- 共有: 共有リンクまたはZIP
- 追補・修正: 既存`id`の再送は上書き扱い（`id`なしは新規）

---

### 連絡先
仕様に関する質問・例外対応はリポジトリ管理者までご連絡ください。

