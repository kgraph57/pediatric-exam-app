-- データベース初期化スクリプト
-- 小児科専門医試験アプリ用

-- users テーブル（ユーザー情報用）
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  level INTEGER DEFAULT 1,
  total_answered INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  -- プロフィール情報
  birth_year VARCHAR(4),
  birth_month VARCHAR(2),
  birth_day VARCHAR(2),
  prefecture VARCHAR(50),
  hospital VARCHAR(255),
  department VARCHAR(100),
  experience_years VARCHAR(10),
  target_level INTEGER DEFAULT 5,
  specialty VARCHAR(100),
  study_goal TEXT,
  daily_goal INTEGER DEFAULT 10,
  weekly_goal INTEGER DEFAULT 50,
  study_time VARCHAR(20) DEFAULT 'evening',
  study_frequency VARCHAR(20) DEFAULT 'daily',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- study_history テーブル（学習履歴用）
CREATE TABLE IF NOT EXISTS study_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  question_id INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER, -- 秒単位
  confidence INTEGER, -- 1-5のスケール
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- category_stats テーブル（カテゴリ別統計用）
CREATE TABLE IF NOT EXISTS category_stats (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  total_answered INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  accuracy DECIMAL(5,2) DEFAULT 0.00,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, category),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- daily_missions テーブル（デイリーミッション用）
CREATE TABLE IF NOT EXISTS daily_missions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  category VARCHAR(50) NOT NULL,
  goal INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'in_progress',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, category),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- user_streaks テーブル（ストリーク用）
CREATE TABLE IF NOT EXISTS user_streaks (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_study_history_user_id ON study_history(user_id);
CREATE INDEX IF NOT EXISTS idx_study_history_question_id ON study_history(question_id);
CREATE INDEX IF NOT EXISTS idx_study_history_answered_at ON study_history(answered_at);
CREATE INDEX IF NOT EXISTS idx_category_stats_user_id ON category_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_missions_user_date ON daily_missions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_date ON user_streaks(user_id, date);

-- デモユーザーの作成（テスト用）
INSERT INTO users (id, email, name, level, total_answered, total_correct, streak, longest_streak, birth_year, birth_month, birth_day, prefecture, hospital, department, experience_years, target_level, specialty, study_goal, daily_goal, weekly_goal, study_time, study_frequency)
VALUES (
  'demo',
  'demo@example.com',
  'デモユーザー',
  3,
  0,
  0,
  0,
  0,
  '1990',
  '4',
  '15',
  '東京都',
  '東京小児科病院',
  '小児科',
  '5',
  7,
  '循環器',
  '小児科専門医取得',
  15,
  80,
  'evening',
  'daily'
) ON CONFLICT (id) DO NOTHING;

-- 既存のテーブルが存在しない場合のフォールバック
-- もし上記のテーブルが作成できない場合は、以下のコメントアウトされたテーブルを使用
/*
-- SQLite用の簡易版
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  level INTEGER DEFAULT 1,
  total_answered INTEGER DEFAULT 0,
  total_correct INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  birth_year TEXT,
  birth_month TEXT,
  birth_day TEXT,
  prefecture TEXT,
  hospital TEXT,
  department TEXT,
  experience_years TEXT,
  target_level INTEGER DEFAULT 5,
  specialty TEXT,
  study_goal TEXT,
  daily_goal INTEGER DEFAULT 10,
  weekly_goal INTEGER DEFAULT 50,
  study_time TEXT DEFAULT 'evening',
  study_frequency TEXT DEFAULT 'daily',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS study_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  question_id INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER,
  confidence INTEGER,
  answered_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_missions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  goal INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'in_progress',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, category)
);

CREATE TABLE IF NOT EXISTS user_streaks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  completed BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);
*/
