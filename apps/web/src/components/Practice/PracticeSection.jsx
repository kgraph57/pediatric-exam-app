import { useState, useEffect, useRef } from "react";
import { Pencil, Flag, Maximize2, Minimize2 } from "lucide-react";
import { saveCurrentSessionProgress } from "../../utils/progressManager";
import { demoQuestions, demoMeta } from "../../data/demoQuestions";
import { 
  saveQuestionAnswer, 
  saveLearningSession, 
  getUserQuestionAnswers,
  getUnansweredQuestions,
  getIncorrectQuestions,
  calculateLearningStats,
  calculateCategoryStats
} from "../../utils/learningHistory";

export function PracticeSection({ user, onToggleSidebar }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answersByIndex, setAnswersByIndex] = useState({});
  const [finished, setFinished] = useState(false);
  const [finishedEarly, setFinishedEarly] = useState(false);
  const [setup, setSetup] = useState({ 
    started: false, 
    category: '', 
    difficulty: '全難易度', 
    questionCount: 10, 
    practiceMode: 'normal',
    learningStyle: 'untimed',
    selectedCategory: '',
    showPracticeModal: false
  });
  const [meta, setMeta] = useState({ categories: [], difficulties: [] });
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [incorrectIds, setIncorrectIds] = useState([]);
  const favoriteCount = favoriteIds.length;
  const incorrectCount = incorrectIds.length;
  const [markedByIndex, setMarkedByIndex] = useState({});
  const [questionStartMs, setQuestionStartMs] = useState(null);
  const [timeSpentByIndex, setTimeSpentByIndex] = useState({});
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const [splitRatio, setSplitRatio] = useState(0.5); // 0..1 左右比率
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);
  const splitRef = useRef(null);

  // カテゴリ別の問題数を取得する関数
  const getCategoryQuestionCount = (categoryName) => {
    if (!meta.categoryStats) return '約50';
    
    // カテゴリ名から英語のキーを取得
    const categoryKey = Object.keys(meta.categoryStats).find(key => 
      meta.categoryStats[key].name === categoryName
    );
    
    if (categoryKey) {
      return meta.categoryStats[categoryKey].count;
    }
    
    return '約50';
  };

  // 初期メタ情報の取得（カテゴリ・難易度）
  useEffect(() => {
    const loadMeta = async () => {
      try {
        const res = await fetch('/api/questions/meta', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          console.log('Meta data loaded:', data);
          setMeta({
            categories: Array.isArray(data.categories) ? data.categories : [],
            difficulties: Array.isArray(data.difficulties) ? data.difficulties : [],
            categoryStats: data.categoryStats || {}
          });
        } else {
          // フォールバック: デモデータを使用
          console.log('Using fallback demo meta data:', demoMeta);
          setMeta({
            categories: demoMeta.categories,
            difficulties: demoMeta.difficulties,
            categoryStats: demoMeta.categoryStats
          });
        }
      } catch (error) {
        console.error('Error loading meta:', error);
        // エラー時もデモデータを使用
        setMeta({
          categories: demoMeta.categories,
          difficulties: demoMeta.difficulties,
          categoryStats: demoMeta.categoryStats
        });
      }
      setLoading(false);
    };
    loadMeta();
  }, []);

  // ローカル保存（お気に入り・間違い）をロード
  useEffect(() => {
    try {
      const fav = JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem('favoriteQuestionIds') || '[]') : '[]');
      const wrong = JSON.parse(typeof window !== 'undefined' ? (localStorage.getItem('incorrectQuestionIds') || '[]') : '[]');
      setFavoriteIds(Array.isArray(fav) ? fav : []);
      setIncorrectIds(Array.isArray(wrong) ? wrong : []);
    } catch {}
  }, []);

  // 進捗更新イベントをリッスン
  useEffect(() => {
    const handleProgressUpdate = () => {
      // 進捗が更新されたことを示すために、コンポーネントを再レンダリング
      setMeta(prevMeta => ({ ...prevMeta }));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('progressUpdated', handleProgressUpdate);
      return () => {
        window.removeEventListener('progressUpdated', handleProgressUpdate);
      };
    }
  }, []);

  // 学習進捗を保存する関数
  const saveProgress = async (questionId, isCorrect, category, timeSpent = 0) => {
    console.log('🚀 saveProgress called:', {
      questionId,
      isCorrect,
      category,
      timeSpent,
      userId: user?.id
    });
    
    try {
      // APIに学習進捗を保存
      if (user?.id) {
        try {
          const response = await fetch(`/api/users/${user.id}/progress`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              questionId,
              isCorrect,
              timeSpent,
              category,
              difficulty: questions.find(q => q.id === questionId)?.difficulty
            }),
          });

          if (!response.ok) {
            console.log('API保存に失敗、ローカルストレージに保存');
          }
        } catch (apiError) {
          console.log('API保存エラー、ローカルストレージに保存:', apiError);
        }
      }

      // ローカルストレージにも保存（フォールバック）
      const progress = JSON.parse(localStorage.getItem('studyProgress') || '{}');
      if (!progress[category]) {
        progress[category] = {};
      }
      
      progress[category][questionId] = {
        isCorrect,
        timestamp: new Date().toISOString(),
        attempts: (progress[category][questionId]?.attempts || 0) + 1,
        timeSpent
      };
      
      localStorage.setItem('studyProgress', JSON.stringify(progress));
      
      // 学習履歴を保存
      if (user?.id) {
        // 問題解答履歴を保存
        saveQuestionAnswer(user.id, questionId, {
          isCorrect,
          timeSpent,
          category,
          difficulty: currentQuestion.difficulty,
          selectedAnswer: selectedAnswers,
          correctAnswer: currentQuestion.correctAnswer
        });

        // ユーザー別の統計を更新
        const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        const currentUserProgress = userProgress[user.id] || {
          studyProgress: {},
          favoriteIds: [],
          incorrectIds: [],
          categoryStats: {},
          totalAnswered: 0,
          totalCorrect: 0,
          currentStreak: 0,
          totalStudyTime: 0,
          lastLogin: new Date().toISOString()
        };

        // 統計を更新
        currentUserProgress.totalAnswered += 1;
        if (isCorrect) {
          currentUserProgress.totalCorrect += 1;
          currentUserProgress.currentStreak += 1;
        } else {
          currentUserProgress.currentStreak = 0;
        }
        currentUserProgress.totalStudyTime += timeSpent;

        // カテゴリ別統計を更新
        if (!currentUserProgress.categoryStats[category]) {
          currentUserProgress.categoryStats[category] = { answered: 0, correct: 0 };
        }
        currentUserProgress.categoryStats[category].answered += 1;
        if (isCorrect) {
          currentUserProgress.categoryStats[category].correct += 1;
        }

        // 保存
        userProgress[user.id] = currentUserProgress;
        localStorage.setItem('userProgress', JSON.stringify(userProgress));
        
        // ユーザーごとの進捗を保存
        saveCurrentSessionProgress(user.id);
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // 学習セッションを保存する関数
  const saveSession = async () => {
    try {
      if (!user?.id || questions.length === 0) return;

      const totalQuestions = questions.length;
      const correctAnswers = Object.values(answersByIndex).filter(answer => answer.isCorrect).length;
      const totalTimeSpent = Object.values(answersByIndex).reduce((total, answer) => total + (answer.timeSpent || 0), 0);

      // 学習セッションを保存
      saveLearningSession(user.id, {
        sessionType: 'practice',
        category: setup.selectedCategory || null,
        difficulty: setup.difficulty !== '全難易度' ? setup.difficulty : null,
        totalQuestions,
        correctAnswers,
        timeSpent: totalTimeSpent,
        questions: questions.map(q => q.id),
        answers: Object.values(answersByIndex)
      });

      // APIにセッションを保存
      const response = await fetch(`/api/users/${user.id}/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionType: 'practice',
          category: setup.selectedCategory || null,
          difficulty: setup.difficulty !== '全難易度' ? setup.difficulty : null,
          totalQuestions,
          correctAnswers,
          timeSpent: totalTimeSpent
        }),
      });

      if (!response.ok) {
        console.log('セッション保存に失敗');
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const startPractice = async () => {
    try {
      setLoading(true);
      setError("");
      
      let questions = [];
      
      if (setup.practiceMode === 'favorites' && favoriteIds.length > 0) {
        // お気に入り問題のみの演習
        questions = demoQuestions.filter(q => favoriteIds.includes(q.id));
      } else if (setup.practiceMode === 'incorrect' && incorrectIds.length > 0) {
        // 間違った問題のみの演習
        questions = demoQuestions.filter(q => incorrectIds.includes(q.id));
      } else {
        // 通常演習または未着手問題 - APIから取得を試行
        try {
          const params = new URLSearchParams();
          if (setup.selectedCategory) params.set('category', setup.selectedCategory);
          if (setup.difficulty && setup.difficulty !== '全難易度') params.set('difficulty', setup.difficulty);
          params.set('count', String(setup.questionCount || 10));
          
          if (setup.practiceMode === 'unattempted') {
            params.set('unattempted', 'true');
          }
          
          const res = await fetch(`/api/questions/daily?${params.toString()}`, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            questions = Array.isArray(data?.questions) ? data.questions : [];
          } else {
            throw new Error('API request failed');
          }
        } catch (apiError) {
          console.log('API failed, using demo data:', apiError);
          // フォールバック: デモデータを使用
          questions = [...demoQuestions];
          
          // カテゴリフィルタ
          if (setup.selectedCategory) {
            const categoryMap = {
              '一般小児科': 'general',
              '新生児・周産期': 'neonatal',
              '呼吸器': 'respiratory',
              '循環器': 'cardiovascular',
              '消化器': 'gastrointestinal',
              '神経': 'neurology',
              '内分泌': 'endocrinology',
              '血液・腫瘍': 'hematology',
              '免疫・アレルギー': 'immunology',
              '感染症': 'infectious',
              '救急・蘇生': 'emergency',
              '発達・行動': 'development'
            };
            const targetCategory = categoryMap[setup.selectedCategory];
            if (targetCategory) {
              questions = questions.filter(q => q.category === targetCategory);
            }
          }
          
          // 難易度フィルタ
          if (setup.difficulty && setup.difficulty !== '全難易度') {
            const difficultyMap = {
              '初級': 'basic',
              '中級': 'intermediate', 
              '上級': 'advanced'
            };
            const targetDifficulty = difficultyMap[setup.difficulty];
            if (targetDifficulty) {
              questions = questions.filter(q => q.difficulty === targetDifficulty);
            }
          }
          
          // 未解答問題を優先的に表示
          if (setup.practiceMode === 'unattempted' && user?.id) {
            const unansweredQuestions = getUnansweredQuestions(user.id, questions);
            if (unansweredQuestions.length > 0) {
              questions = unansweredQuestions;
            }
          }
          
          // 問題数を制限
          if (questions.length > setup.questionCount) {
            questions = questions.slice(0, setup.questionCount);
          }
        }
      }
      
      if (questions.length === 0) {
        throw new Error('選択された条件で問題が見つかりませんでした');
      }
      
      setQuestions(questions);
      
      // お気に入り状態を復元
      const markedState = {};
      questions.forEach((question, index) => {
        if (favoriteIds.includes(question.id)) {
          markedState[index] = true;
        }
      });
      setMarkedByIndex(markedState);
      
      const now = Date.now();
      setStartTime(now);
      setQuestionStartMs(now);
      setSetup((s) => ({ ...s, started: true }));
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setAnswersByIndex({});
      setShowExplanation(false);
      setScore(0);
      setFinished(false);
      setFinishedEarly(false);
    } catch (e) {
      setError("問題の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  // 質問インデックスが変わったら、保存済みの回答状態を復元
  useEffect(() => {
    if (!questions || questions.length === 0) return;
    const saved = answersByIndex[currentQuestionIndex];
    if (saved) {
      setSelectedAnswers(saved.selectedAnswers || []);
      setShowExplanation(!!saved.isChecked);
    } else {
      setSelectedAnswers([]);
      setShowExplanation(false);
    }
    // no-op
  }, [currentQuestionIndex, questions.length, answersByIndex]);

  // ブロック経過タイマー
  useEffect(() => {
    if (!startTime) return;
    const id = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 1000);
    return () => clearInterval(id);
  }, [startTime]);

  useEffect(() => {
    const onFsChange = () => {
      const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(!!fsEl);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // リサイズ用ドラッグハンドラ
  useEffect(() => {
    if (!isDraggingDivider) return;
    const onMove = (e) => {
      if (!splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      let ratio = x / rect.width;
      ratio = Math.max(0.25, Math.min(0.75, ratio));
      setSplitRatio(ratio);
    };
    const onUp = () => setIsDraggingDivider(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDraggingDivider]);

  const enterFullscreen = () => {
    const el = document.documentElement; // fullscreen root to avoid clipped child backgrounds
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  };

  const toggleFullscreen = () => {
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement;
    if (fsEl) exitFullscreen(); else enterFullscreen();
  };

  const formatMs = (ms) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const hh = h > 0 ? String(h).padStart(2, '0') + ':' : '';
    return `${hh}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const recordTimeFor = (index) => {
    if (index == null || questionStartMs == null) return;
    const spent = Date.now() - questionStartMs;
    setTimeSpentByIndex((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + spent,
    }));
    setQuestionStartMs(Date.now());
  };

  const computeScore = (map) => {
    return Object.values(map).filter((a) => a && a.isChecked && a.isCorrect).length;
  };

  const getAnsweredCount = () => {
    return Object.values(answersByIndex).filter((a) => a && a.isChecked).length;
  };

  const isCorrectOption = (optionIndex) => {
    if (!currentQuestion) return false;
    return currentQuestion.type === 'SBA'
      ? optionIndex === currentQuestion.correctAnswer
      : currentQuestion.correctAnswer.includes(optionIndex);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (currentQuestion.type === 'SBA') {
      // 単一選択
      setSelectedAnswers([answerIndex]);
    } else {
      // 複数選択
      if (selectedAnswers.includes(answerIndex)) {
        setSelectedAnswers(selectedAnswers.filter(a => a !== answerIndex));
      } else {
        setSelectedAnswers([...selectedAnswers, answerIndex]);
      }
    }
  };

  const checkAnswer = async () => {
    if (selectedAnswers.length === 0) return;

    const isCorrect = currentQuestion.type === 'SBA'
      ? selectedAnswers[0] === currentQuestion.correctAnswer
      : JSON.stringify([...selectedAnswers].sort()) === JSON.stringify([...currentQuestion.correctAnswer].sort());

    console.log('🔍 checkAnswer called:', {
      questionId: currentQuestion.id,
      isCorrect,
      userId: user?.id,
      category: currentQuestion.category || setup.selectedCategory || '一般小児科',
      selectedAnswers,
      correctAnswer: currentQuestion.correctAnswer
    });

    setAnswersByIndex((prev) => {
      const next = {
        ...prev,
        [currentQuestionIndex]: {
          selectedAnswers: [...selectedAnswers],
          isChecked: true,
          isCorrect,
        },
      };
      setScore(computeScore(next));
      return next;
    });

    // 進捗を保存
    if (user?.id && currentQuestion) {
      const timeSpent = timeSpentByIndex[currentQuestionIndex] || 0;
      const category = currentQuestion.category || setup.selectedCategory || '一般小児科';
      
      console.log('💾 Saving progress:', {
        questionId: currentQuestion.id,
        isCorrect,
        category,
        timeSpent,
        userId: user.id
      });
      
      await saveProgress(
        currentQuestion.id,
        isCorrect,
        category,
        timeSpent
      );
    } else {
      console.log('❌ Progress not saved - missing user or question:', {
        userId: user?.id,
        questionId: currentQuestion?.id
      });
    }

    setShowExplanation(true);
  };

  const nextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      recordTimeFor(currentQuestionIndex);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
      setShowExplanation(false);
    } else {
      // 最後の問題の場合は結果画面を表示
      recordTimeFor(currentQuestionIndex);
      await saveSession();
      setFinished(true);
      setFinishedEarly(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      recordTimeFor(currentQuestionIndex);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const goToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      recordTimeFor(currentQuestionIndex);
      setCurrentQuestionIndex(index);
      const saved = answersByIndex[index];
      setShowExplanation(!!saved?.isChecked);
      setSelectedAnswers(saved?.selectedAnswers || []);
    }
  };

  const finishEarly = async () => {
    if (typeof window !== 'undefined') {
      const ok = window.confirm('演習を途中で終了して結果を表示しますか？');
      if (!ok) return;
    }
    recordTimeFor(currentQuestionIndex);
    await saveSession();
    setFinished(true);
    setFinishedEarly(true);
  };

  const resetQuiz = async () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
    setScore(0);
    setAnswersByIndex({});
    setFinished(false);
    setFinishedEarly(false);
    try {
      setLoading(true);
      setError("");
      // デモモードではローカルのデモデータを使用
      setQuestions(demoQuestions.slice(0, 5));
      setStartTime(Date.now());
    } catch (e) {
      setError("問題の読み込みに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center p-8">問題を読み込み中...</div>;
  if (!setup.started) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        {/* Hero Section */}
        <div className="bg-blue-700 rounded-lg p-4 mb-4 text-white text-center shadow-md">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-xl font-bold mb-1">問題演習を始める</h1>
            <p className="text-base opacity-95">分野別にカテゴリを選んで、効率的な学習を始めましょう</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}



        {/* 進捗凡例 */}
        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-3 mb-3">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">学習進捗の凡例</h3>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
              <span className="text-xs text-gray-700">完了</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-700">部分完了</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
              <span className="text-xs text-gray-700">学習中</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-700">要復習</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
              <span className="text-xs text-gray-700">未着手</span>
            </div>
          </div>
        </div>

        {/* カテゴリ一覧 */}
        <div className="space-y-3">
          {console.log('Rendering categories:', meta.categories)}
          {meta.categories.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-yellow-800 font-medium">
                  カテゴリ情報を読み込み中... ({meta.categories.length}件)
                </span>
              </div>
            </div>
          ) : (
            meta.categories.map((category) => {
            // 直接学習履歴から進捗を計算（移行処理なし）
            const learningSessions = JSON.parse(localStorage.getItem('learningSessions') || '{}');
            const userSessions = learningSessions[user?.id] || [];
            
            console.log('🔍 Direct progress calculation:', {
              userId: user?.id,
              category,
              userSessionsLength: userSessions.length,
              userSessions: userSessions.map(s => ({ 
                id: s.id, 
                category: s.category,
                questions: s.questions?.length, 
                answers: s.answers?.length,
                correctAnswers: s.correctAnswers
              }))
            });
            
            const totalQuestions = getCategoryQuestionCount(category);
            
            // このカテゴリのセッションをフィルタ
            const categorySessions = userSessions.filter(session => 
              session.category === category || 
              (session.category === null && category === '一般小児科')
            );
            
            console.log('📊 Category sessions:', {
              category,
              categorySessionsLength: categorySessions.length,
              categorySessions: categorySessions.map(s => ({ 
                id: s.id, 
                questions: s.questions?.length, 
                correctAnswers: s.correctAnswers 
              }))
            });
            
            // このカテゴリで解答した問題のIDを収集
            const answeredQuestionIds = new Set();
            categorySessions.forEach(session => {
              if (session.questions && Array.isArray(session.questions)) {
                session.questions.forEach(questionId => {
                  answeredQuestionIds.add(questionId);
                });
              }
            });
            
            const answered = answeredQuestionIds.size;
            const progress = totalQuestions > 0 ? Math.min(100, Math.round((answered / totalQuestions) * 100)) : 0;
            const completed = answered;
            const remaining = Math.max(0, totalQuestions - answered);
            
            console.log(`📊 Progress for ${category}:`, {
              userId: user?.id,
              category,
              totalQuestions,
              answeredQuestionIds: Array.from(answeredQuestionIds),
              answered,
              progress,
              completed,
              remaining,
              categorySessionsCount: categorySessions.length
            });
            
            return (
              <div key={category} className="bg-white rounded-md shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {/* カテゴリアイコン */}
                    <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    
                    {/* カテゴリ情報 */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">{category}</h3>
                      <p className="text-xs text-gray-600">
                        問題数: {getCategoryQuestionCount(category)}問 | 進捗: {progress}%
                      </p>
                    </div>
                  </div>

                  {/* 演習開始ボタン */}
                  <button
                    onClick={() => {
                      setSetup((s) => ({ ...s, selectedCategory: category, showPracticeModal: true }));
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-md shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 text-xs"
                  >
                    演習開始
                  </button>
                </div>

                {/* 進捗バー */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="flex h-full">
                    {progress > 0 && (
                      <div 
                        className="bg-blue-700 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                        title={`完了: ${progress}%`}
                      ></div>
                    )}
                    {remaining > 0 && (
                      <div 
                        className="bg-gray-200 h-full transition-all duration-300"
                        style={{ width: `${100 - progress}%` }}
                        title={`未着手: ${100 - progress}%`}
                      ></div>
                    )}
                  </div>
                </div>

                {/* 進捗詳細 */}
                <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
                  <div className="flex items-center space-x-3">
                    {progress > 0 && (
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-700 rounded-full"></div>
                        <span>完了: {progress}%</span>
                      </span>
                    )}
                  </div>
                  <span className="text-gray-500">残り: {remaining}問</span>
                </div>
              </div>
            );
          })
        )}
        </div>

        {/* 演習設定モーダル */}
        {setup.showPracticeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* モーダルヘッダー */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {setup.selectedCategory}の演習設定
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      演習の詳細設定を行ってください
                    </p>
                  </div>
                  <button
                    onClick={() => setSetup(s => ({ ...s, showPracticeModal: false }))}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* モーダルコンテンツ */}
              <div className="p-6 space-y-6">
                {/* 演習モード選択 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">演習モード</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 通常演習 */}
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        setup.practiceMode === 'normal' 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                      }`}
                      onClick={() => setSetup(s => ({ ...s, practiceMode: 'normal' }))}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          setup.practiceMode === 'normal' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                        }`}>
                          {setup.practiceMode === 'normal' && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">通常演習</div>
                          <div className="text-sm text-gray-600">全問題からランダム</div>
                        </div>
                      </div>
                    </div>

                    {/* 未着手問題のみ */}
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        setup.practiceMode === 'unattempted' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                      }`}
                      onClick={() => setSetup(s => ({ ...s, practiceMode: 'unattempted' }))}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          setup.practiceMode === 'unattempted' ? 'border-green-500 bg-green-500' : 'border-gray-300'
                        }`}>
                          {setup.practiceMode === 'unattempted' && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">未着手問題</div>
                          <div className="text-sm text-gray-600">まだ解いていない問題</div>
                        </div>
                      </div>
                    </div>

                    {/* お気に入り問題のみ */}
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        setup.practiceMode === 'favorites' 
                          ? 'border-yellow-500 bg-yellow-50' 
                          : favoriteCount === 0 
                            ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                            : 'border-gray-200 hover:border-yellow-300 hover:bg-yellow-25'
                      }`}
                      onClick={() => favoriteCount > 0 && setSetup(s => ({ ...s, practiceMode: 'favorites' }))}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          setup.practiceMode === 'favorites' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                        }`}>
                          {setup.practiceMode === 'favorites' && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">お気に入り問題</div>
                          <div className="text-sm text-gray-600">{favoriteCount}問</div>
                        </div>
                      </div>
                    </div>

                    {/* 間違った問題のみ */}
                    <div 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        setup.practiceMode === 'incorrect' 
                          ? 'border-red-500 bg-red-50' 
                          : incorrectCount === 0 
                            ? 'border-gray-200 bg-gray-100 cursor-not-allowed' 
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                      }`}
                      onClick={() => incorrectCount > 0 && setSetup(s => ({ ...s, practiceMode: 'incorrect' }))}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          setup.practiceMode === 'incorrect' ? 'border-red-500 bg-red-500' : 'border-gray-300'
                        }`}>
                          {setup.practiceMode === 'incorrect' && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">間違った問題</div>
                          <div className="text-sm text-gray-600">{incorrectCount}問</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 問題数選択 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">問題数</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[5, 10, 15, 20, 25, 30, 40, 50].map((count) => (
                      <div
                        key={count}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                          setup.questionCount === count
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                        }`}
                        onClick={() => setSetup(s => ({ ...s, questionCount: count }))}
                      >
                        <div className="text-lg font-bold">{count}</div>
                        <div className="text-xs text-gray-600">問</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 難易度選択 */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">難易度</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['初級', '中級', '上級', '全難易度'].map((difficulty) => (
                      <div
                        key={difficulty}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center ${
                          setup.difficulty === difficulty
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                        }`}
                        onClick={() => setSetup(s => ({ ...s, difficulty }))}
                      >
                        <div className="font-medium">{difficulty}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 学習スタイル */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">学習スタイル</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { id: 'timed', label: '制限時間あり', desc: '問題ごとに時間制限' },
                      { id: 'untimed', label: '制限時間なし', desc: 'じっくり考えて解答' },
                      { id: 'review', label: '復習モード', desc: '解説を詳しく確認' },
                      { id: 'quick', label: 'クイックモード', desc: '素早く解答' }
                    ].map((style) => (
                      <div
                        key={style.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          setup.learningStyle === style.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                        }`}
                        onClick={() => setSetup(s => ({ ...s, learningStyle: style.id }))}
                      >
                        <div className="font-medium">{style.label}</div>
                        <div className="text-xs text-gray-600">{style.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* モーダルフッター */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSetup(s => ({ ...s, showPracticeModal: false }))}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={() => {
                      setSetup(s => ({ 
                        ...s, 
                        showPracticeModal: false, 
                        started: true,
                        category: s.selectedCategory
                      }));
                      startPractice();
                      // サイドバーを自動で閉じる
                      if (onToggleSidebar) {
                        onToggleSidebar();
                      }
                    }}
                    disabled={!setup.practiceMode || !setup.questionCount}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    演習開始
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  if (questions.length === 0) return <div className="text-center p-8">問題が見つかりません</div>;

  if (finished || currentQuestionIndex >= questions.length) {
    const answeredCount = getAnsweredCount();
    const accuracy = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{finishedEarly ? '演習を終了しました' : '今日の問題完了！'}</h2>
          <div className="space-y-2 mb-6">
            <p className="text-xl text-gray-600">正解数: {score} / {answeredCount}</p>
            <p className="text-sm text-gray-500">回答数: {answeredCount} / {questions.length}</p>
          </div>
          <p className="text-lg text-gray-700 mb-8">正答率: {accuracy}%</p>
          <div className="space-y-4">
            <p className="text-gray-600">
              お疲れさまでした！明日も新しい問題で学習を続けましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
              >
                もう一度挑戦
              </button>
              <button
                onClick={() => {
                  setSetup(s => ({ ...s, started: false }));
                  setFinished(false);
                  setCurrentQuestionIndex(0);
                  setSelectedAnswers([]);
                  setShowExplanation(false);
                  setScore(0);
                  setAnswersByIndex({});
                  setFinishedEarly(false);
                  
                  // 進捗を強制更新するためにカスタムイベントを発火
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('progressUpdated'));
                  }
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
              >
                問題演習画面に戻る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full p-1 lg:p-2">
      {/* ツールバーをグリッドの外に出して、下の行と独立させる（行高の干渉を防止） */}
      <div className="px-1 py-0 lg:px-2 lg:py-0 text-gray-800 mb-0">
        <div className="flex items-center justify-between gap-3 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-2">
            <button onClick={prevQuestion} disabled={currentQuestionIndex === 0} className="px-3 py-1.5 rounded bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50">Previous</button>
            <button onClick={nextQuestion} disabled={currentQuestionIndex >= questions.length - 1} className="px-3 py-1.5 rounded bg-[#007AFF] text-white hover:bg-[#0056CC] disabled:opacity-50">Next</button>
          </div>
          <div className="text-center">
            <p className="text-sm">Item {currentQuestionIndex + 1} of {questions.length}</p>
            <p className="text-xs text-gray-600">Block Time Elapsed: {formatMs(elapsedMs)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded bg-gray-200 hover:bg-gray-300"
              title="Full Screen"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={() => setMarkedByIndex((prev)=>({ ...prev, [currentQuestionIndex]: !prev[currentQuestionIndex] }))}
              className={`px-3 py-1.5 rounded ${markedByIndex[currentQuestionIndex] ? 'bg-yellow-400 text-black' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
              title="Mark"
            >
              Mark
            </button>
            <button onClick={finishEarly} className="px-3 py-1.5 rounded bg-rose-500 hover:bg-rose-600 text-white">End Block</button>
          </div>
        </div>
      </div>

      {/* 本体グリッド：左ナビ + コンテンツを同じ行に配置 */}
      <div className="grid grid-cols-[56px_1fr] gap-x-2 lg:gap-x-3 gap-y-0 items-start">
        {/* 左：問題ナビゲーター */}
        <nav className="hidden md:block sticky top-2 self-start">
          <ul className="flex flex-col gap-2">
            {questions.map((_, i) => {
              const isActive = i === currentQuestionIndex;
              const isAnswered = !!answersByIndex[i]?.isChecked;
              return (
                <li key={i}>
                  <button
                    onClick={() => goToQuestion(i)}
                    className={`${isActive ? 'bg-[#007AFF] text-white border-[#007AFF]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} relative w-12 h-12 rounded-md border text-sm font-semibold flex items-center justify-center`}
                    title={`問題 ${i + 1}`}
                    aria-label={`問題 ${i + 1}`}
                  >
                    {i + 1}
                    {isAnswered && (
                      <span className="absolute -right-1 -top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Pencil size={12} />
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* 問題文と解説の2カラムレイアウト（ツールバー直下に密着） */}
        <div className="col-start-2 mt-0">
          {!showExplanation ? (
            <div className="max-w-3xl mt-4">
              <h2 className="text-sm lg:text-[15px] font-semibold text-gray-800 mt-0 mb-2 leading-relaxed whitespace-pre-wrap break-words">
                {currentQuestion.question.replace(/[A-E]\.\s*[^A-E]*?(?=[A-E]\.|$)/g, '').trim()}
              </h2>
              <div className="space-y-2 mb-5">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAnswers.includes(index)
                        ? 'border-gray-400 bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type={currentQuestion.type === 'SBA' ? 'radio' : 'checkbox'}
                      name="answer"
                      value={index}
                      checked={selectedAnswers.includes(index)}
                      onChange={() => handleAnswerSelect(index)}
                      className="mr-3 text-gray-700"
                    />
                    <span className="text-xs lg:text-sm text-gray-700 font-medium">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </label>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={checkAnswer}
                  disabled={selectedAnswers.length === 0}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors disabled:cursor-not-allowed"
                >
                  解答する
                </button>
              </div>
            </div>
          ) : (
            <div
              ref={splitRef}
              className={`relative flex w-full ${isDraggingDivider ? 'select-none' : ''}`}
              style={{ height: 'calc(100vh - 140px)' }}
            >
              {/* 左パネル：問題 */}
              <div
                className="h-full overflow-y-auto pr-3 mt-4"
                style={{ flexBasis: `${splitRatio * 100}%` }}
              >
                <h2 className="text-sm lg:text-[15px] font-semibold text-gray-800 mb-4 leading-relaxed whitespace-pre-wrap break-words">
                  {currentQuestion.question.replace(/[A-E]\.\s*[^A-E]*?(?=[A-E]\.|$)/g, '').trim()}
                </h2>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSel = selectedAnswers.includes(index);
                    const isCor = isCorrectOption(index);
                    const boxCls = isCor
                      ? 'border-emerald-400 bg-emerald-50 ring-1 ring-emerald-300'
                      : isSel
                        ? 'border-rose-400 bg-rose-50 ring-1 ring-rose-300'
                        : 'border-gray-200 bg-white';
                    const badgeCls = isCor
                      ? 'bg-emerald-500 text-white'
                      : isSel
                        ? 'bg-rose-500 text-white'
                        : 'bg-gray-200 text-gray-500';
                    const badgeText = isCor ? '✓' : isSel ? '✗' : '';
                    return (
                      <label
                        key={index}
                        className={`flex items-center p-3 border-2 rounded-lg ${boxCls}`}
                      >
                        {/* hide native input when採点後 */}
                        <input
                          type={currentQuestion.type === 'SBA' ? 'radio' : 'checkbox'}
                          name="answer"
                          value={index}
                          checked={isSel}
                          disabled
                          className="hidden"
                        />
                        <span className={`mr-3 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${badgeCls}`}>
                          {badgeText}
                        </span>
                        <span className="text-xs lg:text-sm text-gray-700 font-medium">
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* ドラッグハンドル */}
              <div
                onMouseDown={() => setIsDraggingDivider(true)}
                className={`w-2 hover:w-3 transition-[width] cursor-col-resize bg-gray-200 hover:bg-gray-300 h-full rounded`}
              />

              {/* 右パネル：解説 */}
              <div
                className="h-full overflow-y-auto pl-3 mt-4"
                style={{ flexBasis: `${(1 - splitRatio) * 100}%` }}
              >
                <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center flex-wrap gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">正解</p>
                      <p className="text-lg font-bold text-green-600">
                        {currentQuestion.type === 'SBA'
                          ? String.fromCharCode(65 + currentQuestion.correctAnswer)
                          : currentQuestion.correctAnswer.map(i => String.fromCharCode(65 + i)).join(', ')
                        }
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">あなたの解答</p>
                      <p className={`text-lg font-bold ${
                        (currentQuestion.type === 'SBA'
                          ? selectedAnswers[0] === currentQuestion.correctAnswer
                          : JSON.stringify(selectedAnswers.sort()) === JSON.stringify(currentQuestion.correctAnswer.sort()))
                          ? 'text-emerald-600' : 'text-gray-800'
                      }`}>
                        {currentQuestion.type === 'SBA'
                          ? String.fromCharCode(65 + selectedAnswers[0])
                          : selectedAnswers.map(i => String.fromCharCode(65 + i)).join(', ')
                        }
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-600 mb-1">結果</p>
                      <p className={`text-base font-bold ${
                        (currentQuestion.type === 'SBA'
                          ? selectedAnswers[0] === currentQuestion.correctAnswer
                          : JSON.stringify(selectedAnswers.sort()) === JSON.stringify(currentQuestion.correctAnswer.sort()))
                          ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {(currentQuestion.type === 'SBA'
                          ? selectedAnswers[0] === currentQuestion.correctAnswer
                          : JSON.stringify(selectedAnswers.sort()) === JSON.stringify(currentQuestion.correctAnswer.sort()))
                          ? '正解！' : '不正解'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-base font-semibold text-gray-800 mb-4">選択肢の解説</h4>
                  <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-md border border-gray-200 bg-white border-l-4 ${
                          isCorrectOption(index)
                            ? 'border-l-emerald-500'
                            : 'border-l-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCorrectOption(index)
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">
                              {option}
                            </p>
                            <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                              {currentQuestion.explanation[index]}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4 rounded-md mb-6">
                  <h4 className="font-bold text-yellow-800 mb-3 text-base">Key Learning Points</h4>
                  <ul className="list-disc list-inside space-y-2 text-yellow-700">
                    {currentQuestion.keyLearningPoints.map((point, index) => (
                      <li key={index} className="leading-relaxed text-gray-800 text-sm lg:text-base">{point}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-md mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-base">参考文献</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    {currentQuestion.references.map((ref, index) => {
                      const hasUrl = typeof ref === 'string' && ref.includes('http');
                      return (
                        <li key={index} className="leading-relaxed text-sm lg:text-base">
                          {hasUrl ? (
                            <a href={ref.match(/https?:\/\/\S+/)?.[0] || '#'} target="_blank" rel="noreferrer" className="text-blue-600 underline break-all">{ref}</a>
                          ) : (
                            ref
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="text-center">
                  <button
                    onClick={nextQuestion}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
                  >
                    {currentQuestionIndex < questions.length - 1 ? '次の問題' : '結果を見る'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
