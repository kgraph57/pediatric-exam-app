import { useState, useEffect, useRef } from "react";
import { Pencil, Flag, Maximize2, Minimize2, MessageSquare, BookOpen } from "lucide-react";
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
import FeedbackModal from '../Feedback/FeedbackModal';

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
  const [meta, setMeta] = useState(demoMeta);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [incorrectIds, setIncorrectIds] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('question');
  const favoriteCount = favoriteIds.length;
  const incorrectCount = incorrectIds.length;
  const [markedByIndex, setMarkedByIndex] = useState({});
  const [questionStartMs, setQuestionStartMs] = useState(null);
  const [timeSpentByIndex, setTimeSpentByIndex] = useState({});
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  // 現在の問題データ
  const currentQuestionData = questions[currentQuestionIndex];

  // フィードバック送信ハンドラー
  const handleFeedbackSubmit = (feedbackData) => {
    console.log('フィードバックが送信されました:', feedbackData);
  };

  // カテゴリ選択時の処理
  const handleCategorySelect = (category) => {
    setSetup(prev => ({
      ...prev,
      selectedCategory: category,
      showPracticeModal: true
    }));
  };
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
  // 問題演習の設定画面を表示
  if (!setup.started) {
    return (
      <>
      <div className="max-w-6xl mx-auto p-4">
        {/* Hero Section */}
        <div className="bg-blue-700 rounded-lg p-4 mb-4 text-white text-center shadow-md">
          <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold mb-2">小児科専門医試験対策</h1>
              <p className="text-blue-100">実践的な問題演習で合格を目指しましょう</p>
          </div>
        </div>

          {/* カテゴリ選択 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">カテゴリを選択してください</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meta.categories.map((category) => {
                // 直接学習履歴から進捗を計算（移行処理なし）
                const learningSessions = JSON.parse(localStorage.getItem('learningSessions') || '{}');
                const userSessions = learningSessions[user?.id] || [];
                
                const totalQuestions = getCategoryQuestionCount(category);
                
                // このカテゴリのセッションをフィルタ
                const categorySessions = userSessions.filter(session => 
                  session.category === category || 
                  (session.category === null && category === '一般小児科')
                );
                
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
            
            return (
              <div key={category} className="bg-white rounded-md shadow-sm border border-gray-100 p-3 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                        <BookOpen size={16} className="text-blue-600" />
                        <span className="font-medium text-gray-800 text-sm">{category}</span>
                    </div>
                      <span className="text-xs text-gray-500">
                        問題数: {getCategoryQuestionCount(category)}問 | 進捗: {progress}%
                      </span>
                </div>

                {/* 進捗バー */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                        title={`完了: ${progress}%`}
                      ></div>
                      {progress < 100 && (
                      <div 
                        className="bg-gray-200 h-full transition-all duration-300"
                          style={{ width: `${100 - progress}%` }}
                          title={`未着手: ${100 - progress}%`}
                      ></div>
                    )}
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

                    {/* 演習開始ボタン */}
                    <button
                      onClick={() => {
                        setSetup((s) => ({ ...s, selectedCategory: category, showPracticeModal: true }));
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-md shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200 text-xs w-full mt-3"
                    >
                      演習開始
                    </button>
              </div>
            );
              })}
            </div>
          </div>
        </div>

        {/* 演習設定モーダル */}
        {setup.showPracticeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              {/* ヘッダー */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                      {setup.selectedCategory}の演習設定
                    </h3>
                  <button
                    onClick={() => setSetup(s => ({ ...s, showPracticeModal: false }))}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                  ✕
                  </button>
              </div>

              {/* コンテンツ */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    問題数
                  </label>
                  <select
                    value={setup.questionCount}
                    onChange={(e) => setSetup(s => ({ ...s, questionCount: parseInt(e.target.value) }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={5}>5問</option>
                    <option value={10}>10問</option>
                    <option value={20}>20問</option>
                    <option value={30}>30問</option>
                  </select>
                    </div>

                        <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    難易度
                  </label>
                  <select
                    value={setup.difficulty}
                    onChange={(e) => setSetup(s => ({ ...s, difficulty: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="全難易度">全難易度</option>
                    <option value="初級">初級</option>
                    <option value="中級">中級</option>
                    <option value="上級">上級</option>
                  </select>
                    </div>

                        <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    演習モード
                  </label>
                  <select
                    value={setup.practiceMode}
                    onChange={(e) => setSetup(s => ({ ...s, practiceMode: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="normal">通常演習</option>
                    <option value="unattempted">未着手問題</option>
                    <option value="incorrect">間違えた問題</option>
                  </select>
                  </div>
                </div>

              {/* ボタン */}
              <div className="flex space-x-3 p-4 border-t">
                  <button
                    onClick={() => setSetup(s => ({ ...s, showPracticeModal: false }))}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
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
                    }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    演習開始
                  </button>
              </div>
            </div>
          </div>
        )}
        
        {/* フィードバックモーダル */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedbackType={feedbackType}
          questionId={currentQuestionData?.id}
          category={setup.selectedCategory}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      </>
    );
  }

  // 問題が見つからない場合
  if (questions.length === 0) {
    return (
      <>
        <div className="max-w-6xl mx-auto p-4">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">問題が見つかりません</h2>
            <p className="text-gray-600">設定を変更して再度お試しください。</p>
            <button
              onClick={() => setSetup(s => ({ ...s, started: false }))}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              設定に戻る
            </button>
      </div>
        </div>
        
        {/* フィードバックモーダル */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedbackType={feedbackType}
          questionId={currentQuestionData?.id}
          category={setup.selectedCategory}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      </>
    );
  }

  // 演習終了時の処理
  if (finished || currentQuestionIndex >= questions.length) {
    const answeredCount = Object.keys(answersByIndex).length;
    const accuracy = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : 0;
    
    return (
      <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {finishedEarly ? '演習を終了しました' : '演習完了！'}
            </h2>
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors"
            >
              もう一度挑戦
            </button>
            <button
                  onClick={() => {
                    setFeedbackType('question');
                    setShowFeedbackModal(true);
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageSquare size={20} />
                  <span>フィードバック</span>
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

        {/* フィードバックモーダル */}
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          feedbackType={feedbackType}
          questionId={currentQuestionData?.id}
          category={setup.selectedCategory}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      </>
    );
  }

  // 演習中の問題表示
  return (
    <>
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              問題 {currentQuestionIndex + 1} / {questions.length}
              </h2>
            <div className="text-sm text-gray-600">
              {setup.selectedCategory} | {setup.difficulty}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentQuestionData.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestionData.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedAnswers.includes(index)
                      ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                    type="radio"
                      name="answer"
                      value={index}
                      checked={selectedAnswers.includes(index)}
                    onChange={() => setSelectedAnswers([index])}
                    className="mr-3"
                    />
                  <span className="text-gray-700">
                      {String.fromCharCode(65 + index)}. {option}
                    </span>
                  </label>
                ))}
              </div>
          </div>
          
          <div className="flex justify-between">
                <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                  setSelectedAnswers([]);
                }
              }}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              前の問題
                </button>
            
            <button
              onClick={() => {
                if (selectedAnswers.length > 0) {
                  const isCorrect = selectedAnswers[0] === currentQuestionData.correctAnswer;
                  if (isCorrect) {
                    setScore(score + 1);
                  }
                  
                  setAnswersByIndex({
                    ...answersByIndex,
                    [currentQuestionIndex]: {
                      selectedAnswers,
                      isCorrect,
                      isChecked: true
                    }
                  });
                  
                  if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(currentQuestionIndex + 1);
                    setSelectedAnswers([]);
                  } else {
                    setFinished(true);
                  }
                }
              }}
              disabled={selectedAnswers.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? '次の問題' : '演習終了'}
            </button>
                          </div>
                  </div>
                </div>

      {/* フィードバックモーダル */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        feedbackType={feedbackType}
        questionId={currentQuestion?.id}
        category={setup.selectedCategory}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
    </>
  );
}
