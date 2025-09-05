import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const questionsDir = path.join(process.cwd(), '..', '..', 'questions', 'categories');
    
    // 各カテゴリの問題数を取得
    const categories = [
      'cardiovascular', 'respiratory', 'digestive', 'neurology', 
      'endocrinology', 'hematology', 'immunology', 'emergency', 
      'neonatology', 'general'
    ];
    
    const categoryStats = {};
    const difficultiesSet = new Set();
    
    for (const category of categories) {
      const categoryPath = path.join(questionsDir, category, `${category}_questions.json`);
      
      try {
        const fileContent = await fs.readFile(categoryPath, 'utf-8');
        const questions = JSON.parse(fileContent);
        
        // 難易度情報を収集
        for (const q of questions) {
          if (q.difficulty) {
            difficultiesSet.add(q.difficulty);
          }
        }
        
        categoryStats[category] = {
          count: questions.length,
          name: getCategoryDisplayName(category)
        };
      } catch (error) {
        // ファイルが存在しない場合は0問として扱う
        categoryStats[category] = {
          count: 0,
          name: getCategoryDisplayName(category)
        };
      }
    }
    
    // 問題数が0より大きいカテゴリのみを返す
    const activeCategories = Object.entries(categoryStats)
      .filter(([_, data]) => data.count > 0)
      .map(([key, data]) => data.name);
    
    const difficulties = Array.from(difficultiesSet).sort();
    
    return Response.json({ 
      categories: activeCategories, 
      difficulties,
      categoryStats,
      totalCategories: activeCategories.length
    });
    
  } catch (error) {
    console.error('Failed to load question meta:', error);
    return Response.json({ 
      categories: [], 
      difficulties: [],
      error: 'Failed to load question meta'
    }, { status: 500 });
  }
}

function getCategoryDisplayName(category) {
  const displayNames = {
    'cardiovascular': '循環器',
    'respiratory': '呼吸器',
    'digestive': '消化器',
    'neurology': '神経',
    'endocrinology': '内分泌・代謝',
    'hematology': '血液・腫瘍',
    'immunology': '免疫・アレルギー',
    'emergency': '救急',
    'neonatology': '新生児・周産期',
    'general': '一般'
  };
  
  return displayNames[category] || category;
}


