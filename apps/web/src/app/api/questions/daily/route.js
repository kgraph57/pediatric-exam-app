import { neon } from '@neondatabase/serverless';
import { demoQuestions } from '../../../data/demoQuestions.js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const count = parseInt(searchParams.get('count') || '10');
    const unattempted = searchParams.get('unattempted') === 'true';

    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      let questions = [...demoQuestions];
      
      // カテゴリフィルタ
      if (category) {
        const categoryMap = {
          '一般小児科': 'general',
          '新生児・周産期': 'neonatology',
          '呼吸器': 'respiratory',
          '循環器': 'cardiovascular',
          '消化器': 'digestive',
          '神経': 'neurology',
          '内分泌': 'endocrinology',
          '血液・腫瘍': 'hematology',
          '免疫・アレルギー': 'immunology',
          '感染症': 'infectious',
          '救急・蘇生': 'emergency',
          '発達・行動': 'development'
        };
        const targetCategory = categoryMap[category];
        if (targetCategory) {
          questions = questions.filter(q => q.category === targetCategory);
        }
      }
      
      // 難易度フィルタ
      if (difficulty && difficulty !== '全難易度') {
        const difficultyMap = {
          '初級': 'basic',
          '中級': 'intermediate',
          '上級': 'advanced'
        };
        const targetDifficulty = difficultyMap[difficulty];
        if (targetDifficulty) {
          questions = questions.filter(q => q.difficulty === targetDifficulty);
        }
      }
      
      // 問題数を制限
      if (questions.length > count) {
        questions = questions.slice(0, count);
      }
      
      return Response.json({ questions });
    }

    // 実際のデータベースから問題を取得
    const sql = neon(process.env.DATABASE_URL);
    let query = sql`
      SELECT * FROM questions 
      WHERE status = 'published'
    `;
    
    const conditions = [];
    const params = [];
    
    if (category) {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category.toLowerCase());
    }
    
    if (difficulty && difficulty !== '全難易度') {
      conditions.push(`difficulty = $${params.length + 1}`);
      params.push(difficulty.toLowerCase());
    }
    
    if (conditions.length > 0) {
      query = sql`
        SELECT * FROM questions 
        WHERE status = 'published' AND ${sql.unsafe(conditions.join(' AND '))}
      `;
    }
    
    query = sql`
      ${query}
      ORDER BY RANDOM()
      LIMIT ${count}
    `;
    
    const questions = await query;
    
    return Response.json({ questions });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return Response.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
