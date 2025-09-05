#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 既存の問題データを新しいフォルダ構造に変換するスクリプト
 */

const BACKUP_DIR = path.join(__dirname, '../backups');
const CATEGORIES_DIR = path.join(__dirname, '../categories');
const DIFFICULTIES_DIR = path.join(__dirname, '../difficulties');
const VERSIONS_DIR = path.join(__dirname, '../versions');

// カテゴリマッピング（既存のカテゴリ名を新しいフォルダ名にマッピング）
const CATEGORY_MAPPING = {
  '新生児・周産期': 'neonatology',
  '循環器': 'cardiovascular',
  '呼吸器': 'respiratory',
  '消化器': 'digestive',
  '内分泌・代謝': 'endocrinology',
  '感染症・免疫': 'immunology',
  '神経・発達': 'neurology',
  '血液・腫瘍': 'hematology',
  '腎泌尿器': 'general'
};

// 難易度マッピング
const DIFFICULTY_MAPPING = {
  '初学者レベル': 'basic',
  '標準レベル': 'intermediate',
  '専門医レベル': 'advanced',
  '上級': 'expert'
};

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function convertQuestion(question, index) {
  // 既存の問題データを新しいフォーマットに変換
  return {
    id: question.id || `q_${index + 1}`,
    category: CATEGORY_MAPPING[question.category] || 'general',
    difficulty: DIFFICULTY_MAPPING[question.difficulty] || 'intermediate',
    type: question.type || 'SBA',
    version: '2026',
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    keyLearningPoints: question.keyLearningPoints || [],
    references: question.references || [],
    tags: [question.category, question.difficulty].filter(Boolean),
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    author: 'System',
    reviewedBy: 'System',
    status: 'published'
  };
}

function processBackupFiles() {
  const backupFiles = fs.readdirSync(BACKUP_DIR).filter(file => file.endsWith('.jsonl'));
  
  backupFiles.forEach(file => {
    console.log(`Processing: ${file}`);
    const filePath = path.join(BACKUP_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // JSONLファイルを1行ずつ処理
    const questions = content.trim().split('\n')
      .filter(line => line.trim())
      .map((line, index) => {
        try {
          const question = JSON.parse(line);
          return convertQuestion(question, index);
        } catch (error) {
          console.error(`Error parsing line ${index + 1}:`, error.message);
          return null;
        }
      })
      .filter(Boolean);
    
    // カテゴリ別に分類
    const categorizedQuestions = {};
    questions.forEach(question => {
      const category = question.category;
      if (!categorizedQuestions[category]) {
        categorizedQuestions[category] = [];
      }
      categorizedQuestions[category].push(question);
    });
    
    // 各カテゴリフォルダに保存
    Object.entries(categorizedQuestions).forEach(([category, categoryQuestions]) => {
      const categoryDir = path.join(CATEGORIES_DIR, category);
      ensureDirectoryExists(categoryDir);
      
      const outputFile = path.join(categoryDir, `${category}_questions_${file.replace('.jsonl', '.json')}`);
      fs.writeFileSync(outputFile, JSON.stringify(categoryQuestions, null, 2));
      console.log(`Saved ${categoryQuestions.length} questions to ${outputFile}`);
    });
  });
}

function createSampleQuestions() {
  // サンプル問題を作成
  const sampleQuestions = [
    {
      id: 'sample_001',
      category: 'digestive',
      difficulty: 'basic',
      type: 'SBA',
      version: '2026',
      question: '生後3ヶ月の乳児で、嘔吐と下痢が2日間続いている。最も適切な対応はどれか？',
      options: [
        'すぐに抗生物質を投与する',
        '経口補液を行い、様子を見る',
        '絶食を指示する',
        'CT検査を施行する',
        '緊急手術を検討する'
      ],
      correctAnswer: 1,
      explanation: [
        '抗生物質は細菌感染が確認されるまで投与すべきではない',
        '軽度の脱水に対しては経口補液が適切',
        '絶食は脱水を悪化させる可能性がある',
        'CT検査はこの段階では不要',
        '緊急手術は重篤な合併症がない限り不要'
      ],
      keyLearningPoints: [
        '乳児の嘔吐下痢では脱水の評価が重要',
        '軽度脱水には経口補液が第一選択',
        '重篤な症状がない限り、まずは保存的治療'
      ],
      references: [
        '小児科学会ガイドライン 2025年版',
        'https://example.com/pediatric-guidelines'
      ],
      tags: ['digestive', 'basic', 'dehydration', 'oral-rehydration'],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      author: 'System',
      reviewedBy: 'System',
      status: 'published'
    }
  ];
  
  // サンプル問題を各カテゴリに配置
  sampleQuestions.forEach(question => {
    const categoryDir = path.join(CATEGORIES_DIR, question.category);
    ensureDirectoryExists(categoryDir);
    
    const outputFile = path.join(categoryDir, `${question.category}_sample_001.json`);
    fs.writeFileSync(outputFile, JSON.stringify(question, null, 2));
    console.log(`Created sample question: ${outputFile}`);
  });
}

function main() {
  console.log('🚀 問題管理システムの初期化を開始します...');
  
  // 必要なディレクトリを作成
  [CATEGORIES_DIR, DIFFICULTIES_DIR, VERSIONS_DIR].forEach(dir => {
    ensureDirectoryExists(dir);
  });
  
  // バックアップファイルがある場合は変換
  if (fs.existsSync(BACKUP_DIR) && fs.readdirSync(BACKUP_DIR).length > 0) {
    console.log('📁 バックアップファイルを処理中...');
    processBackupFiles();
  }
  
  // サンプル問題を作成
  console.log('📝 サンプル問題を作成中...');
  createSampleQuestions();
  
  console.log('✅ 問題管理システムの初期化が完了しました！');
  console.log('📖 詳細は questions/docs/README.md を参照してください。');
}

if (require.main === module) {
  main();
}

module.exports = { convertQuestion, processBackupFiles };
