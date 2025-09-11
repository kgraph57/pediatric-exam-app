import React, { useState } from 'react';
import { X, Star, MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose, feedbackType, questionId, category, onFeedbackSubmit }) => {
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    const feedbackData = {
      id: Date.now().toString(),
      type: feedbackType, // 'question' or 'overall'
      questionId: questionId || null,
      category: category || null,
      rating,
      difficulty,
      comment: comment.trim(),
      timestamp: new Date().toISOString(),
      userId: JSON.parse(localStorage.getItem('demoUser') || '{}').id
    };

    try {
      // ローカルストレージに保存
      const existingFeedback = JSON.parse(localStorage.getItem('userFeedback') || '{}');
      const userFeedback = existingFeedback[feedbackData.userId] || [];
      userFeedback.push(feedbackData);
      existingFeedback[feedbackData.userId] = userFeedback;
      localStorage.setItem('userFeedback', JSON.stringify(existingFeedback));

      // 親コンポーネントに通知
      if (onFeedbackSubmit) {
        onFeedbackSubmit(feedbackData);
      }

      // フォームをリセット
      setRating(0);
      setDifficulty('');
      setComment('');
      
      // モーダルを閉じる
      onClose();
      
      // 成功メッセージ
      alert('フィードバックを送信しました。ありがとうございます！');
      
    } catch (error) {
      console.error('フィードバック送信エラー:', error);
      alert('フィードバックの送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setDifficulty('');
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            {feedbackType === 'question' ? '問題フィードバック' : '全体的なフィードバック'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* コンテンツ */}
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          {/* 評価 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              この問題の評価 <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  } hover:text-yellow-400`}
                >
                  <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {rating === 0 && '評価を選択してください'}
              {rating === 1 && 'とても悪い'}
              {rating === 2 && '悪い'}
              {rating === 3 && '普通'}
              {rating === 4 && '良い'}
              {rating === 5 && 'とても良い'}
            </p>
          </div>

          {/* 難易度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              難易度 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'easy', label: '簡単', icon: '😊' },
                { value: 'medium', label: '普通', icon: '😐' },
                { value: 'hard', label: '難しい', icon: '😰' }
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(option.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    difficulty === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* コメント */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              コメント・改善提案
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                feedbackType === 'question'
                  ? 'この問題についてのご意見、ご感想、改善提案をお聞かせください...'
                  : 'アプリ全体についてのご意見、ご感想、改善提案をお聞かせください...'
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {comment.length}/500文字
            </div>
          </div>

          {/* ボタン */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={rating === 0 || difficulty === '' || isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>送信中...</span>
                </>
              ) : (
                <>
                  <MessageSquare size={16} />
                  <span>フィードバック送信</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
