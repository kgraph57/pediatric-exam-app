#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 問題データの妥当性を検証するスクリプト
 */

const CATEGORIES_DIR = path.join(__dirname, '../categories');
const DIFFICULTIES_DIR = path.join(__dirname, '../difficulties');
const VERSIONS_DIR = path.join(__dirname, '../versions');

// 必須フィールドの定義
const REQUIRED_FIELDS = [
  'id', 'category', 'difficulty', 'type', 'version',
  'question', 'options', 'correctAnswer', 'explanation'
];

// 有効なカテゴリ
const VALID_CATEGORIES = [
  'digestive', 'respiratory', 'cardiovascular', 'neurology',
  'endocrinology', 'hematology', 'immunology', 'neonatology',
  'emergency', 'general'
];

// 有効な難易度
const VALID_DIFFICULTIES = ['basic', 'intermediate', 'advanced', 'expert'];

// 有効な問題タイプ
const VALID_TYPES = ['SBA', 'MCQ'];

// 有効なステータス
const VALID_STATUSES = ['draft', 'review', 'approved', 'published'];

function validateQuestion(question, filePath) {
  const errors = [];
  const warnings = [];
  
  // 必須フィールドのチェック
  REQUIRED_FIELDS.forEach(field => {
    if (!question.hasOwnProperty(field)) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  // カテゴリの妥当性チェック
  if (question.category && !VALID_CATEGORIES.includes(question.category)) {
    errors.push(`Invalid category: ${question.category}`);
  }
  
  // 難易度の妥当性チェック
  if (question.difficulty && !VALID_DIFFICULTIES.includes(question.difficulty)) {
    errors.push(`Invalid difficulty: ${question.difficulty}`);
  }
  
  // 問題タイプの妥当性チェック
  if (question.type && !VALID_TYPES.includes(question.type)) {
    errors.push(`Invalid type: ${question.type}`);
  }
  
  // ステータスの妥当性チェック
  if (question.status && !VALID_STATUSES.includes(question.status)) {
    errors.push(`Invalid status: ${question.status}`);
  }
  
  // 選択肢の妥当性チェック
  if (question.options) {
    if (!Array.isArray(question.options)) {
      errors.push('Options must be an array');
    } else if (question.options.length < 2) {
      errors.push('Options must have at least 2 choices');
    } else if (question.options.length > 6) {
      errors.push('Options must have at most 6 choices');
    }
  }
  
  // 正解の妥当性チェック
  if (question.correctAnswer !== undefined && question.options) {
    if (question.type === 'SBA') {
      if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
        errors.push(`Invalid correctAnswer: ${question.correctAnswer} for ${question.options.length} options`);
      }
    } else if (question.type === 'MCQ') {
      if (!Array.isArray(question.correctAnswer)) {
        errors.push('MCQ questions must have correctAnswer as an array');
      } else if (question.correctAnswer.some(ans => ans < 0 || ans >= question.options.length)) {
        errors.push(`Invalid correctAnswer array: ${JSON.stringify(question.correctAnswer)}`);
      }
    }
  }
  
  // 解説の妥当性チェック
  if (question.explanation && question.options) {
    if (!Array.isArray(question.explanation)) {
      errors.push('Explanation must be an array');
    } else if (question.explanation.length !== question.options.length) {
      errors.push(`Explanation count (${question.explanation.length}) must match options count (${question.options.length})`);
    }
  }
  
  // 学習ポイントのチェック
  if (question.keyLearningPoints) {
    if (!Array.isArray(question.keyLearningPoints)) {
      errors.push('KeyLearningPoints must be an array');
    } else if (question.keyLearningPoints.length === 0) {
      warnings.push('KeyLearningPoints is empty');
    }
  }
  
  // 参考文献のチェック
  if (question.references) {
    if (!Array.isArray(question.references)) {
      errors.push('References must be an array');
    } else if (question.references.length === 0) {
      warnings.push('References is empty');
    }
  }
  
  // タグのチェック
  if (question.tags) {
    if (!Array.isArray(question.tags)) {
      errors.push('Tags must be an array');
    }
  }
  
  // 日付の妥当性チェック
  if (question.createdAt) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(question.createdAt)) {
      errors.push(`Invalid createdAt format: ${question.createdAt} (expected YYYY-MM-DD)`);
    }
  }
  
  if (question.updatedAt) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(question.updatedAt)) {
      errors.push(`Invalid updatedAt format: ${question.updatedAt} (expected YYYY-MM-DD)`);
    }
  }
  
  return { errors, warnings };
}

function scanDirectory(dirPath, fileExtension = '.json') {
  const results = [];
  
  if (!fs.existsSync(dirPath)) {
    return results;
  }
  
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      results.push(...scanDirectory(itemPath, fileExtension));
    } else if (item.endsWith(fileExtension)) {
      results.push(itemPath);
    }
  });
  
  return results;
}

function main() {
  console.log('🔍 問題データの妥当性検証を開始します...');
  
  let totalFiles = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  let filesWithErrors = 0;
  let filesWithWarnings = 0;
  
  // 全カテゴリディレクトリをスキャン
  const allFiles = scanDirectory(CATEGORIES_DIR);
  
  console.log(`📁 検証対象ファイル数: ${allFiles.length}`);
  
  allFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const question = JSON.parse(content);
      
      const validation = validateQuestion(question, filePath);
      const relativePath = path.relative(process.cwd(), filePath);
      
      if (validation.errors.length > 0) {
        console.log(`❌ ${relativePath}:`);
        validation.errors.forEach(error => {
          console.log(`   - ${error}`);
        });
        totalErrors += validation.errors.length;
        filesWithErrors++;
      }
      
      if (validation.warnings.length > 0) {
        console.log(`⚠️  ${relativePath}:`);
        validation.warnings.forEach(warning => {
          console.log(`   - ${warning}`);
        });
        totalWarnings += validation.warnings.length;
        filesWithWarnings++;
      }
      
      totalFiles++;
      
    } catch (error) {
      console.log(`💥 ${path.relative(process.cwd(), filePath)}: Parse error - ${error.message}`);
      totalErrors++;
      filesWithErrors++;
    }
  });
  
  // 結果サマリー
  console.log('\n📊 検証結果サマリー:');
  console.log(`   📁 総ファイル数: ${totalFiles}`);
  console.log(`   ❌ エラー数: ${totalErrors}`);
  console.log(`   ⚠️  警告数: ${totalWarnings}`);
  console.log(`   🚫 エラーありファイル数: ${filesWithErrors}`);
  console.log(`   ⚠️  警告ありファイル数: ${filesWithWarnings}`);
  
  if (totalErrors === 0) {
    console.log('✅ すべての問題が妥当です！');
  } else {
    console.log('❌ エラーが検出されました。修正が必要です。');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateQuestion, scanDirectory };
