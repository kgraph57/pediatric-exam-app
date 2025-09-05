import fs from 'fs';
import path from 'path';

let cachedQuestions = null;
let cachedAt = 0;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

function getFileDirFromImportMeta() {
  try {
    const url = new URL('.', import.meta.url);
    return url.pathname;
  } catch (e) {
    return process.cwd();
  }
}

function findLatestDatasetFileIn(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const files = entries
      .filter((e) => e.isFile() && (
        /^peds_questions_\d{8}\.jsonl$/.test(e.name) ||
        /^.*_questions_peds_questions_\d+-\d+\.json$/.test(e.name) ||
        /^.*_questions_peds_questions_\d+-\d+\.jsonl$/.test(e.name)
      ))
      .map((e) => e.name)
      .sort((a, b) => {
        // ファイル名から日付や番号を抽出してソート
        const dateMatch = a.match(/peds_questions_(\d{8})/);
        if (dateMatch) {
          return dateMatch[1];
        }
        // 番号ベースのソート
        const numMatch = a.match(/(\d+)-(\d+)/);
        if (numMatch) {
          return parseInt(numMatch[1]);
        }
        return a;
      });
    if (files.length > 0) {
      console.log(`Found files in ${dir}:`, files);
      return path.join(dir, files[0]);
    }
  } catch (e) {
    console.log(`Error reading directory ${dir}:`, e.message);
  }
  return null;
}

function findLatestDatasetFile() {
  const candidates = [];
  
  // 現在のディレクトリから開始
  try {
    let dir = process.cwd();
    for (let i = 0; i < 10; i++) {
      candidates.push(dir);
      const parent = path.resolve(dir, '..');
      if (parent === dir) break;
      dir = parent;
    }
  } catch (e) {}
  
  // このファイルの場所から相対的に検索
  try {
    let dir = getFileDirFromImportMeta();
    for (let i = 0; i < 10; i++) {
      candidates.push(dir);
      const parent = path.resolve(dir, '..');
      if (parent === dir) break;
      dir = parent;
    }
  } catch (e) {}
  
  // 特定のパスも追加
  candidates.push(path.join(process.cwd(), 'apps', 'web', 'src', 'data'));
  candidates.push(path.join(process.cwd(), 'src', 'data'));
  candidates.push(path.join(process.cwd(), 'data'));
  candidates.push(path.join(process.cwd(), 'questions'));
  candidates.push(path.join(process.cwd(), 'questions', 'exports'));
  candidates.push(path.join(process.cwd(), 'questions', 'versions'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'general'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'cardiovascular'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'digestive'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'respiratory'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'emergency'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'endocrinology'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'hematology'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'immunology'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'neonatology'));
  candidates.push(path.join(process.cwd(), 'questions', 'categories', 'neurology'));

  // デバッグ用：各ディレクトリの内容を確認
  console.log('Current working directory:', process.cwd());
  for (const dir of candidates) {
    try {
      if (fs.existsSync(dir)) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const jsonFiles = entries.filter(e => e.isFile() && (e.name.endsWith('.json') || e.name.endsWith('.jsonl')));
        if (jsonFiles.length > 0) {
          console.log(`Found JSON/JSONL files in ${dir}:`, jsonFiles.map(f => f.name));
        }
      }
    } catch (e) {
      // ディレクトリが存在しない場合はスキップ
    }
  }

  // 優先度の高いディレクトリから検索
  const priorityDirs = [
    path.join(process.cwd(), 'questions', 'categories', 'general'),
    path.join(process.cwd(), 'questions', 'categories'),
    path.join(process.cwd(), 'questions'),
    path.join(process.cwd(), 'apps', 'web', 'src', 'data'),
    path.join(process.cwd(), 'src', 'data'),
    path.join(process.cwd(), 'data')
  ];

  // 優先度の高いディレクトリから検索
  for (const dir of priorityDirs) {
    const found = findLatestDatasetFileIn(dir);
    if (found) {
      console.log(`Found dataset file in priority dir: ${found}`);
      return found;
    }
  }

  // その他のディレクトリも検索
  for (const dir of candidates) {
    if (!priorityDirs.includes(dir)) {
      const found = findLatestDatasetFileIn(dir);
      if (found) {
        console.log(`Found dataset file: ${found}`);
        return found;
      }
    }
  }
  
  // デバッグ用：見つからなかった場合のログ
  console.log('Searching in directories:', candidates);
  return null;
}

function normalizeQuestion(raw, indexFallback) {
  const id = raw.id ?? indexFallback;
  const type = raw.type;
  const category = raw.category;
  const difficulty = raw.difficulty;
  const question = raw.question;
  const options = Array.isArray(raw.options) ? raw.options : [];
  let correctAnswer = raw.correctAnswer;
  
  // 難易度の日本語変換
  let difficultyJp = difficulty;
  if (difficulty === 'beginner') difficultyJp = '初級';
  else if (difficulty === 'intermediate') difficultyJp = '中級';
  else if (difficulty === 'advanced') difficultyJp = '上級';
  
  // カテゴリの日本語変換
  let categoryJp = category;
  if (category === 'general') categoryJp = '一般';
  else if (category === 'cardiovascular') categoryJp = '循環器';
  else if (category === 'digestive') categoryJp = '消化器';
  else if (category === 'respiratory') categoryJp = '呼吸器';
  else if (category === 'emergency') categoryJp = '救急';
  else if (category === 'endocrinology') categoryJp = '内分泌・代謝';
  else if (category === 'hematology') categoryJp = '血液・腫瘍';
  else if (category === 'immunology') categoryJp = '免疫・アレルギー';
  else if (category === 'neonatology') categoryJp = '新生児';
  else if (category === 'neurology') categoryJp = '神経';
  
  if (type === 'SBA' && Array.isArray(correctAnswer)) {
    // If mistakenly provided as array for SBA, take first element
    correctAnswer = correctAnswer[0] ?? 0;
  }
  if (type === 'MBA' && !Array.isArray(correctAnswer)) {
    // If mistakenly provided as scalar for MBA, wrap it
    correctAnswer = [Number(correctAnswer)];
  }

  // Explanation: accept array or object map of index->text
  let explanation = raw.explanation ?? [];
  if (!Array.isArray(explanation) && explanation && typeof explanation === 'object') {
    const arr = [];
    for (let i = 0; i < options.length; i++) {
      const key = String(i);
      arr[i] = explanation[key] ?? '';
    }
    explanation = arr;
  }

  const keyLearningPoints = raw.keyLearningPoints ?? raw.key_points ?? [];
  const references = raw.references ?? [];
  const tags = raw.tags ?? [];
  const media = raw.media ?? null;

  return {
    id,
    type,
    category: categoryJp,
    difficulty: difficultyJp,
    question,
    options,
    correctAnswer,
    explanation,
    keyLearningPoints,
    references,
    tags,
    media,
  };
}

export async function loadQuestionsFromJSONL() {
  const now = Date.now();
  if (cachedQuestions && now - cachedAt < CACHE_TTL_MS) {
    return cachedQuestions;
  }

  const filePath = findLatestDatasetFile();

  if (!filePath) {
    console.warn('No dataset file found, using fallback data');
    // フォールバックデータを提供
    const fallbackQuestions = [
      {
        id: 'fallback_1',
        type: 'SBA',
        category: '循環器',
        difficulty: '中級',
        question: '小児の心臓病で最も頻度が高いのはどれか？',
        options: ['心室中隔欠損', '心房中隔欠損', '動脈管開存', 'ファロー四徴症', '大動脈縮窄'],
        correctAnswer: 0,
        explanation: ['心室中隔欠損は小児の先天性心疾患で最も頻度が高い。']
      },
      {
        id: 'fallback_2',
        type: 'SBA',
        category: '感染症',
        difficulty: '初級',
        question: '小児の風邪の原因として最も多いのはどれか？',
        options: ['細菌', 'ウイルス', '真菌', '寄生虫', 'アレルギー'],
        correctAnswer: 1,
        explanation: ['小児の風邪の原因は90%以上がウイルスである。']
      },
      {
        id: 'fallback_3',
        type: 'SBA',
        category: '消化器',
        difficulty: '初級',
        question: '乳児の嘔吐で最も注意すべき症状はどれか？',
        options: ['軽度の発熱', '機嫌が悪い', '胆汁性嘔吐', '軽度の下痢', '食欲不振'],
        correctAnswer: 2,
        explanation: ['胆汁性嘔吐は腸閉塞を示唆する重要な症状である。']
      },
      {
        id: 'fallback_4',
        type: 'SBA',
        category: '内分泌・代謝',
        difficulty: '中級',
        question: '小児の糖尿病で最も多いのはどれか？',
        options: ['1型糖尿病', '2型糖尿病', 'MODY', '新生児糖尿病', '二次性糖尿病'],
        correctAnswer: 0,
        explanation: ['小児の糖尿病では1型糖尿病が最も多い。']
      },
      {
        id: 'fallback_5',
        type: 'SBA',
        category: '小児神経',
        difficulty: '初級',
        question: '熱性けいれんの特徴として正しいのはどれか？',
        options: ['6ヶ月未満で発症', '38度以上で発症', '15分以上持続', '局所症状を伴う', '意識障害を残す'],
        correctAnswer: 1,
        explanation: ['熱性けいれんは38度以上の発熱を伴って発症する。']
      },
      {
        id: 'fallback_6',
        type: 'SBA',
        category: '一般',
        difficulty: '初級',
        question: '新生児の正常な体重増加は1日あたり何gか？',
        options: ['10-15g', '15-30g', '30-50g', '50-70g', '70-100g'],
        correctAnswer: 1,
        explanation: ['新生児の正常な体重増加は1日あたり15-30gである。']
      },
      {
        id: 'fallback_7',
        type: 'SBA',
        category: '救急',
        difficulty: '中級',
        question: '小児の心肺停止で最も重要な初期対応はどれか？',
        options: ['気道確保', '胸骨圧迫', '除細動', '薬物投与', '輸液'],
        correctAnswer: 0,
        explanation: ['小児の心肺停止では、まず気道確保が最も重要である。']
      },
      {
        id: 'fallback_8',
        type: 'SBA',
        category: '血液・腫瘍',
        difficulty: '上級',
        question: '小児白血病の最も多い症状はどれか？',
        options: ['発熱', '貧血', '出血傾向', '骨痛', 'リンパ節腫大'],
        correctAnswer: 0,
        explanation: ['小児白血病では発熱が最も多い症状である。']
      }
    ];
    
    cachedQuestions = fallbackQuestions;
    cachedAt = now;
    return fallbackQuestions;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    let questions = [];
    
    // ファイルの拡張子に応じて処理を分岐
    if (filePath.endsWith('.json')) {
      try {
        // JSONファイルの場合
        const data = JSON.parse(content);
        if (Array.isArray(data)) {
          questions = data.map((obj, index) => normalizeQuestion(obj, index + 1));
        } else {
          console.error('Invalid JSON format: expected array');
          throw new Error('Invalid JSON format');
        }
      } catch (e) {
        console.error('Failed to parse JSON file:', e.message);
        throw e;
      }
    } else {
      // JSONLファイルの場合
      const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        try {
          const obj = JSON.parse(line);
          questions.push(normalizeQuestion(obj, i + 1));
        } catch (e) {
          console.warn(`Failed to parse line ${i + 1}:`, e.message);
        }
      }
    }
    
    console.log(`Successfully loaded ${questions.length} questions from ${filePath}`);
    cachedQuestions = questions;
    cachedAt = now;
    return questions;
  } catch (error) {
    console.error('Failed to load questions:', error);
    throw error;
  }
}

export default loadQuestionsFromJSONL;



