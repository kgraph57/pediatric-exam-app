import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    // データベース接続がない場合はデモデータを返す
    if (!process.env.DATABASE_URL) {
      return Response.json({
        categories: [
          "一般小児科",
          "新生児・周産期", 
          "呼吸器",
          "循環器",
          "消化器",
          "神経",
          "内分泌",
          "血液・腫瘍",
          "免疫・アレルギー",
          "感染症",
          "救急・蘇生",
          "発達・行動"
        ],
        difficulties: ["初級", "中級", "上級", "全難易度"],
        categoryStats: {
          "一般小児科": { name: "一般小児科", count: 150 },
          "新生児・周産期": { name: "新生児・周産期", count: 120 },
          "呼吸器": { name: "呼吸器", count: 100 },
          "循環器": { name: "循環器", count: 80 },
          "消化器": { name: "消化器", count: 90 },
          "神経": { name: "神経", count: 70 },
          "内分泌": { name: "内分泌", count: 60 },
          "血液・腫瘍": { name: "血液・腫瘍", count: 50 },
          "免疫・アレルギー": { name: "免疫・アレルギー", count: 40 },
          "感染症": { name: "感染症", count: 110 },
          "救急・蘇生": { name: "救急・蘇生", count: 80 },
          "発達・行動": { name: "発達・行動", count: 30 }
        }
      });
    }

    // 実際のデータベースからカテゴリ情報を取得
    const sql = neon(process.env.DATABASE_URL);
    const categories = await sql`
      SELECT DISTINCT category, COUNT(*) as count 
      FROM questions 
      WHERE status = 'published'
      GROUP BY category
      ORDER BY category
    `;

    const difficulties = await sql`
      SELECT DISTINCT difficulty 
      FROM questions 
      WHERE status = 'published'
      ORDER BY difficulty
    `;

    const categoryStats = {};
    categories.forEach(row => {
      categoryStats[row.category] = {
        name: row.category,
        count: parseInt(row.count)
      };
    });

    return Response.json({
      categories: categories.map(row => row.category),
      difficulties: difficulties.map(row => row.difficulty),
      categoryStats
    });

  } catch (error) {
    console.error('Error fetching question meta:', error);
    return Response.json(
      { error: 'Failed to fetch question metadata' },
      { status: 500 }
    );
  }
}
