import sql from '@/app/api/utils/sql';

export async function POST(request) {
  try {
    const { userId, questionId, selectedAnswer, timeSpent, confidence } = await request.json();

    if (!userId || !questionId || selectedAnswer === undefined) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the question to check correct answer
    const questionResult = await sql('SELECT correct_answer FROM questions WHERE id = $1', [questionId]);
    
    if (questionResult.length === 0) {
      return Response.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const correctAnswer = questionResult[0].correct_answer;
    const isCorrect = selectedAnswer === correctAnswer;

    // Insert study history record
    const historyResult = await sql(`
      INSERT INTO study_history (user_id, question_id, is_correct, time_spent, confidence)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [userId, questionId, isCorrect, timeSpent || null, confidence || null]);

    // Update user statistics
    await sql(`
      UPDATE users 
      SET 
        total_answered = total_answered + 1,
        total_correct = total_correct + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [isCorrect ? 1 : 0, userId]);

    // Update category statistics
    const questionCategory = await sql('SELECT category FROM questions WHERE id = $1', [questionId]);
    if (questionCategory.length > 0) {
      const category = questionCategory[0].category;
      
      await sql(`
        INSERT INTO category_stats (user_id, category, total_answered, total_correct, accuracy)
        VALUES ($1, $2, 1, $3, $4)
        ON CONFLICT (user_id, category)
        DO UPDATE SET
          total_answered = category_stats.total_answered + 1,
          total_correct = category_stats.total_correct + $3,
          accuracy = ROUND(
            (category_stats.total_correct + $3) * 100.0 / (category_stats.total_answered + 1), 
            2
          ),
          updated_at = CURRENT_TIMESTAMP
      `, [userId, category, isCorrect ? 1 : 0, isCorrect ? 100 : 0]);

      // Update daily mission progress
      const today = new Date().toISOString().split('T')[0];
      try {
        await sql(`
          UPDATE daily_missions 
          SET progress = progress + 1,
              status = CASE WHEN progress + 1 >= goal THEN 'completed' ELSE 'in_progress' END,
              updated_at = CURRENT_TIMESTAMP
          WHERE user_id = $1 AND date = $2 AND category = $3
        `, [userId, today, category]);
      } catch (error) {
        console.log('Daily mission update error:', error.message);
      }
    }

    // Update user streak for today
    const today = new Date().toISOString().split('T')[0];
    try {
      await sql(`
        INSERT INTO user_streaks (user_id, date, completed)
        VALUES ($1, $2, TRUE)
        ON CONFLICT (user_id, date)
        DO UPDATE SET completed = TRUE
      `, [userId, today]);
    } catch (error) {
      console.log('User streak update error:', error.message);
    }

    return Response.json({
      success: true,
      isCorrect,
      correctAnswer,
      history: historyResult[0]
    });
  } catch (error) {
    console.error('Error saving study history:', error);
    return Response.json(
      { error: 'Failed to save study history' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit')) || 50;

    if (!userId) {
      return Response.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const result = await sql(`
      SELECT 
        sh.*,
        q.category,
        q.difficulty,
        q.question_text
      FROM study_history sh
      JOIN questions q ON sh.question_id = q.id
      WHERE sh.user_id = $1
      ORDER BY sh.answered_at DESC
      LIMIT $2
    `, [userId, limit]);

    return Response.json(result);
  } catch (error) {
    console.error('Error fetching study history:', error);
    return Response.json(
      { error: 'Failed to fetch study history' },
      { status: 500 }
    );
  }
}