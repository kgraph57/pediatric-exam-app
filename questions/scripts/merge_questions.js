#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 各カテゴリの問題を統合して、アプリケーションで使用できる形式に変換するスクリプト
 */

const CATEGORIES_DIR = path.join(__dirname, '../categories');
const DIFFICULTIES_DIR = path.join(__dirname, '../difficulties');
const VERSIONS_DIR = path.join(__dirname, '../versions');
const EXPORTS_DIR = path.join(__dirname, '../exports');

function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
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

function loadQuestionsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const questions = JSON.parse(content);
    
    // 単一の問題の場合、配列に変換
    if (!Array.isArray(questions)) {
      return [questions];
    }
    
    return questions;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return [];
  }
}

function mergeAllQuestions() {
  console.log('🔄 全問題の統合を開始します...');
  
  const allQuestions = [];
  const categoryStats = {};
  
  // 全カテゴリディレクトリをスキャン
  const allFiles = scanDirectory(CATEGORIES_DIR);
  
  console.log(`📁 処理対象ファイル数: ${allFiles.length}`);
  
  allFiles.forEach(filePath => {
    const questions = loadQuestionsFromFile(filePath);
    const category = path.basename(path.dirname(filePath));
    
    if (!categoryStats[category]) {
      categoryStats[category] = 0;
    }
    
    questions.forEach(question => {
      // ファイルパス情報を追加
      question.sourceFile = path.relative(CATEGORIES_DIR, filePath);
      allQuestions.push(question);
      categoryStats[category]++;
    });
  });
  
  console.log('\n📊 カテゴリ別問題数:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`   ${category}: ${count}問`);
  });
  
  console.log(`\n📝 総問題数: ${allQuestions.length}問`);
  
  return allQuestions;
}

function createCategoryBasedExports(allQuestions) {
  console.log('\n📤 カテゴリ別エクスポートを作成中...');
  
  const questionsByCategory = {};
  
  // カテゴリ別に分類
  allQuestions.forEach(question => {
    const category = question.category;
    if (!questionsByCategory[category]) {
      questionsByCategory[category] = [];
    }
    questionsByCategory[category].push(question);
  });
  
  // 各カテゴリのJSONファイルを作成
  Object.entries(questionsByCategory).forEach(([category, questions]) => {
    const outputFile = path.join(EXPORTS_DIR, `${category}_questions.json`);
    fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2));
    console.log(`   ✅ ${category}: ${questions.length}問 → ${outputFile}`);
  });
}

function createDifficultyBasedExports(allQuestions) {
  console.log('\n📤 難易度別エクスポートを作成中...');
  
  const questionsByDifficulty = {};
  
  // 難易度別に分類
  allQuestions.forEach(question => {
    const difficulty = question.difficulty;
    if (!questionsByDifficulty[difficulty]) {
      questionsByDifficulty[difficulty] = [];
    }
    questionsByDifficulty[difficulty].push(question);
  });
  
  // 各難易度のJSONファイルを作成
  Object.entries(questionsByDifficulty).forEach(([difficulty, questions]) => {
    const outputFile = path.join(EXPORTS_DIR, `${difficulty}_questions.json`);
    fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2));
    console.log(`   ✅ ${difficulty}: ${questions.length}問 → ${outputFile}`);
  });
}

function createVersionBasedExports(allQuestions) {
  console.log('\n📤 年度別エクスポートを作成中...');
  
  const questionsByVersion = {};
  
  // 年度別に分類
  allQuestions.forEach(question => {
    const version = question.version;
    if (!questionsByVersion[version]) {
      questionsByVersion[version] = [];
    }
    questionsByVersion[version].push(question);
  });
  
  // 各年度のJSONファイルを作成
  Object.entries(questionsByVersion).forEach(([version, questions]) => {
    const outputFile = path.join(EXPORTS_DIR, `version_${version}_questions.json`);
    fs.writeFileSync(outputFile, JSON.stringify(questions, null, 2));
    console.log(`   ✅ ${version}: ${questions.length}問 → ${outputFile}`);
  });
}

function createCombinedExport(allQuestions) {
  console.log('\n📤 統合エクスポートを作成中...');
  
  // 全問題を含む統合ファイル
  const combinedFile = path.join(EXPORTS_DIR, 'all_questions.json');
  fs.writeFileSync(combinedFile, JSON.stringify(allQuestions, null, 2));
  console.log(`   ✅ 統合ファイル: ${allQuestions.length}問 → ${combinedFile}`);
  
  // アプリケーション用のJSONLファイル（既存形式との互換性）
  const jsonlFile = path.join(EXPORTS_DIR, 'peds_questions_merged.jsonl');
  const jsonlContent = allQuestions.map(q => JSON.stringify(q)).join('\n');
  fs.writeFileSync(jsonlFile, jsonlContent);
  console.log(`   ✅ JSONLファイル: ${allQuestions.length}問 → ${jsonlFile}`);
}

function createMetadata(allQuestions) {
  console.log('\n📊 メタデータを作成中...');
  
  const metadata = {
    totalQuestions: allQuestions.length,
    categories: {},
    difficulties: {},
    versions: {},
    types: {},
    lastUpdated: new Date().toISOString(),
    stats: {
      byCategory: {},
      byDifficulty: {},
      byVersion: {},
      byType: {}
    }
  };
  
  // 統計情報を収集
  allQuestions.forEach(question => {
    // カテゴリ統計
    if (!metadata.stats.byCategory[question.category]) {
      metadata.stats.byCategory[question.category] = 0;
    }
    metadata.stats.byCategory[question.category]++;
    
    // 難易度統計
    if (!metadata.stats.byDifficulty[question.difficulty]) {
      metadata.stats.byDifficulty[question.difficulty] = 0;
    }
    metadata.stats.byDifficulty[question.difficulty]++;
    
    // 年度統計
    if (!metadata.stats.byVersion[question.version]) {
      metadata.stats.byVersion[question.version] = 0;
    }
    metadata.stats.byVersion[question.version]++;
    
    // タイプ統計
    if (!metadata.stats.byType[question.type]) {
      metadata.stats.byType[question.type] = 0;
    }
    metadata.stats.byType[question.type]++;
  });
  
  // ユニークな値を収集
  metadata.categories = Object.keys(metadata.stats.byCategory).sort();
  metadata.difficulties = Object.keys(metadata.stats.byDifficulty).sort();
  metadata.versions = Object.keys(metadata.stats.byVersion).sort();
  metadata.types = Object.keys(metadata.stats.byType).sort();
  
  const metadataFile = path.join(EXPORTS_DIR, 'metadata.json');
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  console.log(`   ✅ メタデータ: ${metadataFile}`);
  
  return metadata;
}

function main() {
  console.log('🚀 問題統合スクリプトを開始します...');
  
  // エクスポートディレクトリを作成
  ensureDirectoryExists(EXPORTS_DIR);
  
  // 全問題を統合
  const allQuestions = mergeAllQuestions();
  
  if (allQuestions.length === 0) {
    console.log('❌ 問題が見つかりませんでした。');
    return;
  }
  
  // 各種エクスポートを作成
  createCategoryBasedExports(allQuestions);
  createDifficultyBasedExports(allQuestions);
  createVersionBasedExports(allQuestions);
  createCombinedExport(allQuestions);
  
  // メタデータを作成
  const metadata = createMetadata(allQuestions);
  
  console.log('\n✅ 問題統合が完了しました！');
  console.log(`📁 エクスポート先: ${EXPORTS_DIR}`);
  console.log(`📊 総問題数: ${metadata.totalQuestions}問`);
  console.log(`🏷️  カテゴリ数: ${metadata.categories.length}`);
  console.log(`📈 難易度数: ${metadata.difficulties.length}`);
  console.log(`📅 年度数: ${metadata.versions.length}`);
}

if (require.main === module) {
  main();
}

module.exports = { 
  mergeAllQuestions, 
  createCategoryBasedExports, 
  createDifficultyBasedExports,
  createVersionBasedExports,
  createCombinedExport,
  createMetadata
};
