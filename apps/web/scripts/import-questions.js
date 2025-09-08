import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 問題データファイルのパス
const questionsDir = join(__dirname, '../../../../questions/categories');

// カテゴリマッピング
const categoryMapping = {
  'general': '一般小児科',
  'neonatology': '新生児・周産期',
  'respiratory': '呼吸器',
  'cardiovascular': '循環器',
  'digestive': '消化器',
  'neurology': '神経',
  'endocrinology': '内分泌',
  'hematology': '血液・腫瘍',
  'immunology': '免疫・アレルギー',
  'infectious': '感染症',
  'emergency': '救急・蘇生',
  'development': '発達・行動'
};

// 難易度マッピング
const difficultyMapping = {
  'basic': '初級',
  'intermediate': '中級',
  'advanced': '上級',
  'expert': '上級'
};

async function importQuestions() {
  try {
    console.log('問題データのインポートを開始します...');

    // データベース接続チェック
    if (!process.env.DATABASE_URL) {
      console.log('DATABASE_URLが設定されていません。デモモードで実行します。');
      return;
    }

    let totalImported = 0;

    // 各カテゴリのファイルを処理
    for (const [englishCategory, japaneseCategory] of Object.entries(categoryMapping)) {
      const categoryDir = join(questionsDir, englishCategory);
      
      try {
        // カテゴリディレクトリ内のJSONファイルを取得
        const files = readdirSync(categoryDir).filter(file => file.endsWith('.json'));
        
        for (const file of files) {
          const filePath = join(categoryDir, file);
          console.log(`処理中: ${filePath}`);
          
          const questionsData = JSON.parse(readFileSync(filePath, 'utf8'));
          
          for (const question of questionsData) {
            try {
              // 問題データをデータベースに挿入
              const sql = neon(process.env.DATABASE_URL);
              await sql`
                INSERT INTO questions (
                  id, category, difficulty, type, version, question,
                  options, correct_answer, explanation, key_learning_points,
                  references, tags, author, reviewed_by, status
                ) VALUES (
                  ${question.id},
                  ${japaneseCategory},
                  ${difficultyMapping[question.difficulty] || question.difficulty},
                  ${question.type || 'SBA'},
                  ${question.version || '2026'},
                  ${question.question},
                  ${JSON.stringify(question.options)},
                  ${question.correctAnswer},
                  ${JSON.stringify(question.explanation || [])},
                  ${JSON.stringify(question.keyLearningPoints || [])},
                  ${JSON.stringify(question.references || [])},
                  ${JSON.stringify(question.tags || [])},
                  ${question.author || 'System'},
                  ${question.reviewedBy || 'System'},
                  ${question.status || 'published'}
                ) ON CONFLICT (id) DO UPDATE SET
                  category = EXCLUDED.category,
                  difficulty = EXCLUDED.difficulty,
                  question = EXCLUDED.question,
                  options = EXCLUDED.options,
                  correct_answer = EXCLUDED.correct_answer,
                  explanation = EXCLUDED.explanation,
                  key_learning_points = EXCLUDED.key_learning_points,
                  references = EXCLUDED.references,
                  tags = EXCLUDED.tags,
                  updated_at = NOW()
              `;
              
              totalImported++;
            } catch (error) {
              console.error(`問題 ${question.id} のインポートに失敗:`, error);
            }
          }
        }
      } catch (error) {
        console.log(`カテゴリ ${englishCategory} の処理をスキップ:`, error.message);
      }
    }

    console.log(`インポート完了: ${totalImported}問の問題を処理しました`);

  } catch (error) {
    console.error('インポート中にエラーが発生しました:', error);
  }
}

// スクリプト実行
if (import.meta.url === `file://${process.argv[1]}`) {
  importQuestions();
}

export { importQuestions };
