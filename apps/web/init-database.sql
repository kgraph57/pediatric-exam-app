-- 小児科試験アプリ データベース初期化スクリプト

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    hospital VARCHAR(255),
    department VARCHAR(100),
    experience_years INTEGER,
    target_level INTEGER DEFAULT 5,
    specialty VARCHAR(100),
    study_goal TEXT,
    daily_goal INTEGER DEFAULT 15,
    weekly_goal INTEGER DEFAULT 80,
    level INTEGER DEFAULT 1,
    total_answered INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 学習履歴テーブル
CREATE TABLE IF NOT EXISTS study_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER, -- 秒
    answered_at TIMESTAMP DEFAULT NOW()
);

-- お気に入り問題テーブル
CREATE TABLE IF NOT EXISTS favorite_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- 間違い問題テーブル
CREATE TABLE IF NOT EXISTS incorrect_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- 問題テーブル
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(255) PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    type VARCHAR(20) DEFAULT 'SBA',
    version VARCHAR(10) DEFAULT '2026',
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation JSONB,
    key_learning_points JSONB,
    references JSONB,
    tags JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    author VARCHAR(100),
    reviewed_by VARCHAR(100),
    status VARCHAR(20) DEFAULT 'published'
);

-- 学習セッションテーブル
CREATE TABLE IF NOT EXISTS study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_type VARCHAR(50) DEFAULT 'practice', -- practice, exam, review
    category VARCHAR(100),
    difficulty VARCHAR(50),
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    time_spent INTEGER, -- 秒
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- ユーザー進捗テーブル
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    question_id VARCHAR(255) REFERENCES questions(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL,
    time_spent INTEGER, -- 秒
    answered_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, question_id)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_study_history_user_id ON study_history(user_id);
CREATE INDEX IF NOT EXISTS idx_study_history_answered_at ON study_history(answered_at);
CREATE INDEX IF NOT EXISTS idx_favorite_questions_user_id ON favorite_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_incorrect_questions_user_id ON incorrect_questions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_status ON questions(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_question_id ON user_progress(question_id);

-- デモユーザーの作成（既存でない場合のみ）
INSERT INTO users (
    id, name, email, password_hash, hospital, department,
    experience_years, target_level, specialty, study_goal,
    daily_goal, weekly_goal, level
) VALUES (
    'demo-user-id',
    'デモユーザー',
    'demo@example.com',
    '$argon2id$v=19$m=65536,t=3,p=4$demo$demo', -- デモ用のハッシュ
    '東京小児科病院',
    '小児科',
    5,
    7,
    '循環器',
    '小児科専門医取得',
    15,
    80,
    3
) ON CONFLICT (email) DO NOTHING;

-- 統計情報を更新する関数
CREATE OR REPLACE FUNCTION update_user_stats(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users SET
        total_answered = (
            SELECT COUNT(*) FROM study_history 
            WHERE user_id = user_uuid
        ),
        total_correct = (
            SELECT COUNT(*) FROM study_history 
            WHERE user_id = user_uuid AND is_correct = true
        ),
        streak = (
            SELECT COALESCE(MAX(streak_count), 0)
            FROM (
                SELECT COUNT(*) as streak_count
                FROM (
                    SELECT DATE(answered_at) as study_date
                    FROM study_history
                    WHERE user_id = user_uuid AND is_correct = true
                    GROUP BY DATE(answered_at)
                    ORDER BY study_date DESC
                ) daily_studies
                WHERE study_date >= CURRENT_DATE - INTERVAL '30 days'
            ) streak_calc
        ),
        updated_at = NOW()
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;
