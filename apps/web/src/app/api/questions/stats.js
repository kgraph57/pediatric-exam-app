import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const questionsDir = path.join(process.cwd(), '..', 'questions', 'categories');
    
    // デバッグ情報を追加
    console.log('Current working directory:', process.cwd());
    console.log('Questions directory path:', questionsDir);
    
    // ディレクトリの存在確認
    try {
      await fs.access(questionsDir);
      console.log('Questions directory exists');
    } catch (error) {
      console.error('Questions directory not found:', questionsDir);
      return Response.json(
        { 
          success: false, 
          error: 'Questions directory not found',
          debug: {
            cwd: process.cwd(),
            questionsDir,
            error: error.message
          }
        },
        { status: 500 }
      );
    }
    
    // 各カテゴリの問題数を取得
    const categories = [
      'cardiovascular', 'respiratory', 'digestive', 'neurology', 
      'endocrinology', 'hematology', 'immunology', 'emergency', 
      'neonatology', 'general'
    ];
    
    const categoryStats = {};
    let totalQuestions = 0;
    
    for (const category of categories) {
      const categoryPath = path.join(questionsDir, category, `${category}_questions.json`);
      
      try {
        const fileContent = await fs.readFile(categoryPath, 'utf-8');
        const questions = JSON.parse(fileContent);
        const questionCount = questions.length;
        
        categoryStats[category] = {
          count: questionCount,
          name: getCategoryDisplayName(category)
        };
        
        totalQuestions += questionCount;
        console.log(`Category ${category}: ${questionCount} questions`);
      } catch (error) {
        console.error(`Error reading category ${category}:`, error.message);
        // ファイルが存在しない場合は0問として扱う
        categoryStats[category] = {
          count: 0,
          name: getCategoryDisplayName(category)
        };
      }
    }
    
    console.log(`Total questions: ${totalQuestions}`);
    
    return Response.json({
      success: true,
      totalQuestions,
      categoryStats,
      categories: Object.keys(categoryStats),
      lastUpdated: new Date().toISOString(),
      debug: {
        cwd: process.cwd(),
        questionsDir
      }
    });
    
  } catch (error) {
    console.error('Error fetching question stats:', error);
    return Response.json(
      { 
        success: false, 
        error: 'Failed to fetch question stats',
        debug: {
          cwd: process.cwd(),
          error: error.message
        }
      },
      { status: 500 }
    );
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
