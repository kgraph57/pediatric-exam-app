import { neon } from '@neondatabase/serverless';
import { promises as fs } from 'fs';
import path from 'path';

// 実際の問題データベースを読み込む関数
const loadQuestionsFromDatabase = async () => {
  try {
    const questionsDir = path.join(process.cwd(), '..', 'questions', 'categories');
    const categories = [
      'cardiovascular', 'respiratory', 'digestive', 'neurology',
      'endocrinology', 'hematology', 'immunology', 'emergency',
      'neonatology', 'general'
    ];

    let allQuestions = [];
    
    for (const category of categories) {
      const categoryPath = path.join(questionsDir, category, `${category}_questions.json`);
      try {
        const fileContent = await fs.readFile(categoryPath, 'utf-8');
        const questions = JSON.parse(fileContent);
        allQuestions = allQuestions.concat(questions);
      } catch (error) {
        console.log(`Warning: Could not load questions for category ${category}:`, error.message);
      }
    }

    return allQuestions;
  } catch (error) {
    console.log('Warning: Could not load questions from database, using fallback');
    return [];
  }
};

// 開発環境用のSQLiteフォールバック
const createSQLiteFallback = async () => {
  // 実際の問題データベースを読み込み
  const questions = await loadQuestionsFromDatabase();
  
  // デモユーザー
  const users = [
    {
      id: 'demo',
      email: 'demo@example.com',
      name: 'デモユーザー',
      level: 3,
      total_answered: 0,
      total_correct: 0,
      streak: 0,
      longest_streak: 0,
      birth_year: '1990',
      birth_month: '4',
      birth_day: '15',
      prefecture: '東京都',
      hospital: '東京小児科病院',
      department: '小児科',
      experience_years: '5',
      target_level: 7,
      specialty: '循環器',
      study_goal: '小児科専門医取得',
      daily_goal: 15,
      weekly_goal: 80,
      study_time: 'evening',
      study_frequency: 'daily',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const studyHistory = [];
  const categoryStats = [];
  const dailyMissions = [];
  const userStreaks = [];

  const sqliteDB = {
    // クエリ実行関数
    async query(sql, params = []) {
      console.log('SQLite Fallback Query:', sql, params);
      
      // 簡単なSQLパーサー（開発用）
      const upperSql = sql.toUpperCase();
      
      if (upperSql.includes('SELECT')) {
        if (upperSql.includes('FROM USERS')) {
          if (upperSql.includes('WHERE ID')) {
            return users.filter(u => u.id === params[0]);
          }
          if (upperSql.includes('WHERE EMAIL')) {
            return users.filter(u => u.email === params[0]);
          }
          if (upperSql.includes('LIKE \'TEST_%\'') || upperSql.includes('LIKE \'test_%\'')) {
            return users.filter(u => u.id.startsWith('test_'));
          }
          return users;
        }
        if (upperSql.includes('FROM QUESTIONS')) {
          if (upperSql.includes('WHERE ID')) {
            return questions.filter(q => q.id === params[0]);
          }
          if (upperSql.includes('WHERE CATEGORY')) {
            return questions.filter(q => q.category === params[0]);
          }
          if (upperSql.includes('ORDER BY RANDOM()')) {
            return [questions[Math.floor(Math.random() * questions.length)]];
          }
          return questions;
        }
        if (upperSql.includes('FROM STUDY_HISTORY')) {
          return studyHistory;
        }
        if (upperSql.includes('FROM CATEGORY_STATS')) {
          return categoryStats;
        }
        if (upperSql.includes('FROM DAILY_MISSIONS')) {
          if (upperSql.includes('WHERE USER_ID') && upperSql.includes('WHERE DATE')) {
            return dailyMissions.filter(m => m.user_id === params[0] && m.date === params[1]);
          }
          return dailyMissions;
        }
        if (upperSql.includes('FROM USER_STREAKS')) {
          return userStreaks;
        }
      }
      
      if (upperSql.includes('INSERT')) {
        if (upperSql.includes('INTO USERS')) {
          const newUser = {
            id: params[0],
            email: params[1],
            name: params[2],
            level: params[3],
            total_answered: params[4],
            total_correct: params[5],
            streak: params[6],
            longest_streak: params[7],
            birth_year: params[8],
            birth_month: params[9],
            birth_day: params[10],
            prefecture: params[11],
            hospital: params[12],
            department: params[13],
            experience_years: params[14],
            target_level: params[15],
            specialty: params[16],
            study_goal: params[17],
            daily_goal: params[18],
            weekly_goal: params[19],
            study_time: params[20],
            study_frequency: params[21],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          users.push(newUser);
          return [newUser];
        }
        if (upperSql.includes('INTO DAILY_MISSIONS')) {
          const newMission = {
            id: dailyMissions.length + 1,
            user_id: params[0],
            date: params[1],
            category: params[2],
            goal: params[3],
            progress: 0,
            status: 'in_progress',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          dailyMissions.push(newMission);
          return [newMission];
        }
        if (upperSql.includes('INTO STUDY_HISTORY')) {
          const newHistory = {
            id: studyHistory.length + 1,
            user_id: params[0],
            question_id: params[1],
            is_correct: params[2],
            time_spent: params[3],
            confidence: params[4],
            answered_at: new Date().toISOString()
          };
          studyHistory.push(newHistory);
          return [newHistory];
        }
      }
      
      if (upperSql.includes('UPDATE')) {
        if (upperSql.includes('USERS')) {
          const userIndex = users.findIndex(u => u.id === params[0]);
          if (userIndex !== -1) {
            // 簡単な更新処理
            Object.assign(users[userIndex], {
              updated_at: new Date().toISOString()
            });
            return [users[userIndex]];
          }
        }
        if (upperSql.includes('DAILY_MISSIONS')) {
          const missionIndex = dailyMissions.findIndex(m => 
            m.user_id === params[1] && m.date === params[2]
          );
          if (missionIndex !== -1) {
            dailyMissions[missionIndex].progress = params[0];
            dailyMissions[missionIndex].status = params[0] >= dailyMissions[missionIndex].goal ? 'completed' : 'in_progress';
            dailyMissions[missionIndex].updated_at = new Date().toISOString();
            return [dailyMissions[missionIndex]];
          }
        }
      }
      
      if (upperSql.includes('DELETE')) {
        if (upperSql.includes('FROM USERS')) {
          const userIndex = users.findIndex(u => u.id === params[0]);
          if (userIndex !== -1) {
            const deletedUser = users.splice(userIndex, 1)[0];
            return [deletedUser];
          }
        }
        if (upperSql.includes('FROM STUDY_HISTORY')) {
          const historyIndex = studyHistory.findIndex(h => h.user_id === params[0]);
          if (historyIndex !== -1) {
            studyHistory.splice(historyIndex, 1);
          }
          return [];
        }
        if (upperSql.includes('FROM DAILY_MISSIONS')) {
          const missionIndex = dailyMissions.findIndex(m => m.user_id === params[0]);
          if (missionIndex !== -1) {
            dailyMissions.splice(missionIndex, 1);
          }
          return [];
        }
      }
      
      return [];
    },
    
    // トランザクション関数
    async transaction(callback) {
      return await callback(sqliteDB);
    }
  };

  return sqliteDB;
};

// データベース接続の設定
let sqlInstance = null;

const getSQL = async () => {
  if (sqlInstance) {
    return sqlInstance;
  }

  if (process.env.DATABASE_URL) {
    sqlInstance = neon(process.env.DATABASE_URL);
  } else {
    console.log('⚠️  DATABASE_URL not set, using SQLite fallback for development');
    sqlInstance = await createSQLiteFallback();
  }

  return sqlInstance;
};

// デフォルトエクスポート関数
const sql = async (query, params = []) => {
  const db = await getSQL();
  return await db.query(query, params);
};

// トランザクション関数
sql.transaction = async (callback) => {
  const db = await getSQL();
  return await db.transaction(callback);
};

export default sql;