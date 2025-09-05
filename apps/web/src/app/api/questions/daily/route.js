import { loadQuestionsFromJSONL } from '@/app/api/utils/loadQuestionsFromJSONL';

function getSeedForToday() {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

function seededShuffle(array, seed) {
  const result = [...array];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const rnd = s / 233280;
    const j = Math.floor(rnd * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const countParam = searchParams.get('count');
    const count = Math.min(Math.max(parseInt(countParam || '5', 10) || 5, 1), 50);

    const all = await loadQuestionsFromJSONL();

    let filtered = all;
    if (category && category !== '') {
      filtered = filtered.filter((q) => q.category === category);
    }
    if (difficulty && difficulty !== '') {
      filtered = filtered.filter((q) => q.difficulty === difficulty);
    }

    if (filtered.length === 0) {
      return Response.json({ error: '条件に合致する問題がありません' }, { status: 404 });
    }

    const seed = getSeedForToday();
    const shuffled = seededShuffle(filtered, seed);
    const picked = shuffled.slice(0, count);

    return Response.json({ questions: picked });
  } catch (error) {
    console.error('Failed to load daily questions:', error);
    return Response.json({ error: '問題の読み込みに失敗しました' }, { status: 500 });
  }
}


