import { neon } from '@neondatabase/serverless';
import { demoQuestions } from '../../../data/demoQuestions.js';

export async function POST(request) {
  try {
    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({ 
        message: 'デモモード: 問題データのインポートはスキップされました',
        imported: demoQuestions.length,
        total: demoQuestions.length
      });
    }

    const sql = neon(process.env.DATABASE_URL);
    let importedCount = 0;

    // デモ問題データをデータベースにインポート
    for (const question of demoQuestions) {
      try {
        await sql`
          INSERT INTO questions (
            id, category, difficulty, type, version, question,
            options, correct_answer, explanation, key_learning_points,
            references, tags, author, reviewed_by, status
          ) VALUES (
            ${question.id},
            ${question.category},
            ${question.difficulty},
            ${question.type || 'SBA'},
            ${question.version || '2026'},
            ${question.question},
            ${JSON.stringify(question.options)},
            ${question.correctAnswer},
            ${JSON.stringify(question.explanation || [])},
            ${JSON.stringify(question.keyLearningPoints || [])},
            ${JSON.stringify(question.references || [])},
            ${JSON.stringify(question.tags || [])},
            ${question.author || 'System'},
            ${question.reviewedBy || 'System'},
            ${question.status || 'published'}
          ) ON CONFLICT (id) DO UPDATE SET
            category = EXCLUDED.category,
            difficulty = EXCLUDED.difficulty,
            question = EXCLUDED.question,
            options = EXCLUDED.options,
            correct_answer = EXCLUDED.correct_answer,
            explanation = EXCLUDED.explanation,
            key_learning_points = EXCLUDED.key_learning_points,
            references = EXCLUDED.references,
            tags = EXCLUDED.tags,
            updated_at = NOW()
        `;
        
        importedCount++;
      } catch (error) {
        console.error(`問題 ${question.id} のインポートに失敗:`, error);
      }
    }

    return Response.json({ 
      message: '問題データのインポートが完了しました',
      imported: importedCount,
      total: demoQuestions.length
    });

  } catch (error) {
    console.error('Error importing questions:', error);
    return Response.json(
      { error: '問題データのインポートに失敗しました' },
      { status: 500 }
    );
  }
}
