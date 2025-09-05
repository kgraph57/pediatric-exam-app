import sql from '@/app/api/utils/sql';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const today = new Date().toISOString().split('T')[0];

    if (!id) {
      return Response.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get today's mission or create a new one
    let missionResult = await sql(`
      SELECT * FROM daily_missions 
      WHERE user_id = $1 AND date = $2
      LIMIT 1
    `, [id, today]);

    let mission;
    
    if (missionResult.length === 0) {
      // Create a new mission for today
      const categories = ['neonatology', 'cardiovascular', 'respiratory', 'digestive', 'endocrinology', 'immunology', 'neurology', 'hematology', 'general'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const goal = Math.floor(Math.random() * 8) + 3; // 3-10 questions

      const insertResult = await sql(`
        INSERT INTO daily_missions (user_id, date, category, goal, progress, status)
        VALUES ($1, $2, $3, $4, 0, 'in_progress')
        RETURNING *
      `, [id, today, randomCategory, goal]);

      mission = insertResult[0];
    } else {
      mission = missionResult[0];
    }

    // Get category name in Japanese
    const categoryNames = {
      'neonatology': '新生児・周産期',
      'cardiovascular': '循環器',
      'respiratory': '呼吸器',
      'digestive': '消化器',
      'endocrinology': '内分泌・代謝',
      'immunology': '感染症・免疫',
      'neurology': '神経・発達',
      'hematology': '血液・腫瘍',
      'general': '一般・その他'
    };

    return Response.json({
      id: mission.id,
      category: mission.category,
      categoryName: categoryNames[mission.category] || mission.category,
      goal: mission.goal,
      progress: mission.progress,
      status: mission.status,
      date: mission.date,
      percentage: Math.round((mission.progress / mission.goal) * 100)
    });
  } catch (error) {
    console.error('Error fetching daily mission:', error);
    return Response.json(
      { error: 'Failed to fetch daily mission' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const { progress } = await request.json();
    const today = new Date().toISOString().split('T')[0];

    if (!id || progress === undefined) {
      return Response.json(
        { error: 'User ID and progress are required' },
        { status: 400 }
      );
    }

    // Update mission progress
    const updateResult = await sql(`
      UPDATE daily_missions 
      SET progress = $1, status = CASE WHEN $1 >= goal THEN 'completed' ELSE 'in_progress' END
      WHERE user_id = $2 AND date = $3
      RETURNING *
    `, [progress, id, today]);

    if (updateResult.length === 0) {
      return Response.json(
        { error: 'Mission not found' },
        { status: 404 }
      );
    }

    const mission = updateResult[0];

    return Response.json({
      id: mission.id,
      category: mission.category,
      goal: mission.goal,
      progress: mission.progress,
      status: mission.status,
      percentage: Math.round((mission.progress / mission.goal) * 100)
    });
  } catch (error) {
    console.error('Error updating daily mission:', error);
    return Response.json(
      { error: 'Failed to update daily mission' },
      { status: 500 }
    );
  }
}
