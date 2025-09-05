import sql from '@/app/api/utils/sql';

export async function POST(request) {
  try {
    const { userId, message, context } = await request.json();

    if (!message) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get user context for personalized responses
    let userContext = '';
    if (userId) {
      try {
        // Get user stats
        const userResult = await sql('SELECT * FROM users WHERE id = $1', [userId]);
        const categoryStatsResult = await sql(`
          SELECT category, accuracy, total_answered, total_correct 
          FROM category_stats 
          WHERE user_id = $1 
          ORDER BY accuracy ASC
        `, [userId]);
        
        if (userResult.length > 0) {
          const user = userResult[0];
          const accuracy = user.total_answered > 0 
            ? Math.round((user.total_correct / user.total_answered) * 100)
            : 0;
          
          userContext = `
ユーザー情報:
- 学習レベル: ${user.level}
- 総問題数: ${user.total_answered}
- 総正解数: ${user.total_correct}
- 全体正解率: ${accuracy}%
- 連続学習日数: ${user.streak}

カテゴリ別成績:
${categoryStatsResult.map(cat => 
  `- ${cat.category}: ${cat.accuracy}% (${cat.total_correct}/${cat.total_answered})`
).join('\n')}
`;
        }
      } catch (error) {
        console.warn('Failed to fetch user context:', error);
      }
    }

    // Create system prompt for pediatric exam preparation
    const systemPrompt = `あなたは小児科専門医試験対策の専門AIアシスタントです。

役割:
- 小児科医学の専門知識を持つ学習サポーター
- 問題の詳細解説と重要ポイントの説明
- 学習計画の提案と弱点分析
- モチベーション維持のためのコーチング

対応分野:
- 新生児学、循環器学、感染症学、アレルギー学
- 内分泌学、腎泌尿器学、消化器学、呼吸器学
- 血液学、神経学、整形外科学、皮膚科学

回答スタイル:
- 医学的に正確で分かりやすい説明
- 重要ポイントは番号付きリストで整理
- 学習者のレベルに合わせた内容
- 励ましと具体的なアドバイスを含む

${userContext ? `現在のユーザー情報:\n${userContext}` : ''}

常に日本語で回答し、医学的正確性を最優先に、学習者の理解促進を図ってください。`;

    // Make request to ChatGPT
    const chatResponse = await fetch('/integrations/chat-gpt/conversationgpt4', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    if (!chatResponse.ok) {
      throw new Error('Failed to get AI response');
    }

    const chatResult = await chatResponse.json();
    const aiMessage = chatResult.choices[0]?.message?.content;

    if (!aiMessage) {
      throw new Error('No response from AI');
    }

    // Save chat interaction if user is provided
    if (userId) {
      try {
        await sql(`
          INSERT INTO study_history (user_id, question_id, is_correct, time_spent, confidence, answered_at)
          VALUES ($1, NULL, NULL, NULL, NULL, CURRENT_TIMESTAMP)
        `, [userId]);
      } catch (error) {
        console.warn('Failed to log AI interaction:', error);
      }
    }

    return Response.json({
      message: aiMessage,
      success: true
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return Response.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}