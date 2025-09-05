import sql from '@/app/api/utils/sql';
import { loadQuestionsFromJSONL } from '@/app/api/utils/loadQuestionsFromJSONL';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

    // Build the query
    let query = `SELECT * FROM questions WHERE 1=1`;
    const params = [];
    let paramIndex = 1;

    if (category && category !== '') {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    if (difficulty && difficulty !== '') {
      query += ` AND difficulty = $${paramIndex}`;
      params.push(difficulty);
      paramIndex++;
    }

    query += ` ORDER BY RANDOM() LIMIT 1`;

    let question = null;
    try {
      const result = await sql(query, params);
      if (result.length > 0) {
        const q = result[0];
        q.options = JSON.parse(q.options);
        if (q.key_points) q.key_points = JSON.parse(q.key_points);
        question = {
          id: q.id,
          type: q.type,
          category: q.category,
          difficulty: q.difficulty,
          question: q.question,
          options: q.options,
          correctAnswer: q.correct_answer ?? q.correctAnswer,
          explanation: q.explanation ?? [],
          keyLearningPoints: q.key_points ?? q.keyLearningPoints ?? [],
          references: q.references ?? [],
        };
      }
    } catch (e) {
      // if DB is not configured, fall back to JSONL
    }

    if (!question) {
      const all = await loadQuestionsFromJSONL();
      let filtered = all;
      if (category && category !== '') filtered = filtered.filter(q => q.category === category);
      if (difficulty && difficulty !== '') filtered = filtered.filter(q => q.difficulty === difficulty);
      if (filtered.length === 0) {
        return Response.json(
          { error: 'No questions found for the specified criteria' },
          { status: 404 }
        );
      }
      const rand = Math.floor(Math.random() * filtered.length);
      question = filtered[rand];
    }

    return Response.json(question);
  } catch (error) {
    console.error('Error fetching random question:', error);
    return Response.json(
      { error: 'Failed to fetch question' },
      { status: 500 }
    );
  }
}