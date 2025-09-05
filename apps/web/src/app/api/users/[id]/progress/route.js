import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ユーザーの進捗を取得
export async function GET(request, { params }) {
  try {
    const { id } = params;

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // ローカルストレージから進捗を取得
      if (typeof window !== 'undefined') {
        const allProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        const userProgress = allProgress[id];
        
        if (userProgress) {
          return Response.json({
            userId: id,
            studyProgress: userProgress.studyProgress || {},
            favoriteIds: userProgress.favoriteIds || [],
            incorrectIds: userProgress.incorrectIds || [],
            categoryStats: userProgress.categoryStats || {},
            lastLogin: userProgress.lastLogin || new Date().toISOString()
          });
        }
      }

      return Response.json({
        userId: id,
        studyProgress: {},
        favoriteIds: [],
        incorrectIds: [],
        categoryStats: {},
        lastLogin: new Date().toISOString()
      });
    }

    // データベースから進捗を取得
    const result = await pool.query(
      'SELECT * FROM study_history WHERE user_id = $1',
      [id]
    );

    const studyProgress = {};
    const favoriteIds = [];
    const incorrectIds = [];

    result.rows.forEach(row => {
      if (!studyProgress[row.category]) {
        studyProgress[row.category] = {};
      }
      
      studyProgress[row.category][row.question_id] = {
        isCorrect: row.is_correct,
        timestamp: row.answered_at,
        attempts: row.attempts
      };

      if (row.is_favorite) {
        favoriteIds.push(row.question_id);
      }

      if (!row.is_correct) {
        incorrectIds.push(row.question_id);
      }
    });

    return Response.json({
      userId: id,
      studyProgress,
      favoriteIds,
      incorrectIds,
      categoryStats: {},
      lastLogin: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get user progress error:', error);
    return Response.json(
      { message: 'ユーザー進捗の取得に失敗しました' },
      { status: 500 }
    );
  }
}

// ユーザーの進捗をリセット
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // データベースが利用できない場合のデモモード
    if (!process.env.DATABASE_URL) {
      // ローカルストレージから進捗を削除
      if (typeof window !== 'undefined') {
        const allProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        allProgress[id] = {
          studyProgress: {},
          favoriteIds: [],
          incorrectIds: [],
          categoryStats: {},
          lastLogin: new Date().toISOString()
        };
        localStorage.setItem('userProgress', JSON.stringify(allProgress));
        
        // 現在のユーザーの統計もリセット
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        if (currentUser.id === id) {
          const resetUser = {
            ...currentUser,
            totalAnswered: 0,
            totalCorrect: 0,
            streak: 0,
            longestStreak: 0,
            categoryStats: []
          };
          localStorage.setItem('currentUser', JSON.stringify(resetUser));
        }
      }

      return Response.json({
        message: 'ユーザーの進捗がリセットされました'
      });
    }

    // データベースから進捗を削除
    await pool.query(
      'DELETE FROM study_history WHERE user_id = $1',
      [id]
    );

    // ユーザーの統計もリセット
    await pool.query(
      `UPDATE users SET 
        total_answered = 0, total_correct = 0, streak = 0, 
        longest_streak = 0, updated_at = NOW()
      WHERE id = $1`,
      [id]
    );

    return Response.json({
      message: 'ユーザーの進捗がリセットされました'
    });

  } catch (error) {
    console.error('Reset user progress error:', error);
    return Response.json(
      { message: 'ユーザー進捗のリセットに失敗しました' },
      { status: 500 }
    );
  }
}
