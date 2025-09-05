import sql from '@/app/api/utils/sql';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    // SQLスクリプトを読み込み
    const sqlScriptPath = path.join(process.cwd(), 'src/app/api/utils/init-db.sql');
    let sqlScript;
    
    try {
      sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');
    } catch (error) {
      console.log('SQL script not found, using inline SQL');
      // フォールバック用のSQL
      sqlScript = `
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
          UNIQUE(user_id, date, category)
        );

        CREATE TABLE IF NOT EXISTS user_streaks (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          date DATE NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, date)
        );
      `;
    }

    // SQLスクリプトを実行
    const statements = sqlScript
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('/*'));

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql(statement);
          console.log('Executed SQL:', statement.substring(0, 50) + '...');
        } catch (error) {
          console.log('SQL execution error (continuing):', error.message);
        }
      }
    }

    // デモユーザー用の初期データを作成
    const today = new Date().toISOString().split('T')[0];
    
    // 今日のミッションを作成（存在しない場合）
    try {
      await sql(`
        INSERT INTO daily_missions (user_id, date, category, goal, progress, status)
        VALUES ($1, $2, $3, $4, 0, 'in_progress')
        ON CONFLICT (user_id, date, category) DO NOTHING
      `, ['demo', today, 'cardiovascular', 5]);
    } catch (error) {
      console.log('Demo mission creation error:', error.message);
    }

    // 今日のストリークレコードを作成（存在しない場合）
    try {
      await sql(`
        INSERT INTO user_streaks (user_id, date, completed)
        VALUES ($1, $2, FALSE)
        ON CONFLICT (user_id, date) DO NOTHING
      `, ['demo', today]);
    } catch (error) {
      console.log('Demo streak creation error:', error.message);
    }

    return Response.json({
      success: true,
      message: 'Database initialized successfully',
      tables: ['daily_missions', 'user_streaks']
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return Response.json(
      { 
        error: 'Failed to initialize database',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
