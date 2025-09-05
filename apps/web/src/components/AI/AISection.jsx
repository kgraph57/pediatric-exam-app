import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Bot, Send, User, Lightbulb, BookOpen, TrendingUp } from 'lucide-react';

export function AISection({ user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'こんにちは！小児科試験対策のAIアシスタントです。学習に関することなら何でもお聞きください。問題の解説、弱点分析、学習計画の提案などお手伝いできます。',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const sendMessageMutation = useMutation({
    mutationFn: async (message) => {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          message,
          context: 'pediatric_exam_prep'
        }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      return response.json();
    },
    onSuccess: (response) => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        content: response.message,
        timestamp: new Date(),
      }]);
    },
  });

  const quickPrompts = [
    {
      icon: Lightbulb,
      title: '弱点分析',
      subtitle: '学習データから弱点を分析',
      prompt: '私の学習データを分析して、特に弱い分野や改善すべき点を教えてください。'
    },
    {
      icon: BookOpen,
      title: '問題解説',
      subtitle: '難しい問題の詳細解説',
      prompt: '最後に間違えた問題について、なぜその答えが正しいのか詳しく解説してください。'
    },
    {
      icon: TrendingUp,
      title: '学習計画',
      subtitle: '効率的な学習スケジュール',
      prompt: '小児科専門医試験に向けて、効率的な学習計画を立ててください。'
    },
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sendMessageMutation.isPending) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    await sendMessageMutation.mutateAsync(inputMessage.trim());
  };

  const handleQuickPrompt = async (prompt) => {
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: prompt,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    await sendMessageMutation.mutateAsync(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#34C759]/10 rounded-lg">
            <Bot className="text-[#34C759]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              AIアシスタント
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              小児科試験対策のサポートをします
            </p>
          </div>
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length === 1 && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            よく使われる質問
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickPrompts.map((prompt, index) => {
              const Icon = prompt.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="p-4 text-left rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#34C759] hover:bg-[#34C759]/5 transition-all"
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon className="text-[#34C759]" size={20} />
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {prompt.title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {prompt.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.type === 'ai' 
                ? 'bg-[#34C759]/10' 
                : 'bg-[#007AFF]/10'
            }`}>
              {message.type === 'ai' ? (
                <Bot className="text-[#34C759]" size={16} />
              ) : (
                <User className="text-[#007AFF]" size={16} />
              )}
            </div>
            <div className={`max-w-3xl ${
              message.type === 'user' ? 'ml-auto' : 'mr-auto'
            }`}>
              <div className={`p-4 rounded-2xl ${
                message.type === 'ai'
                  ? 'bg-white dark:bg-[#262626] shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700'
                  : 'bg-[#007AFF] text-white'
              }`}>
                <p className={`leading-relaxed ${
                  message.type === 'ai' 
                    ? 'text-gray-900 dark:text-gray-100' 
                    : 'text-white'
                }`}>
                  {message.content}
                </p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-2">
                {message.timestamp.toLocaleTimeString('ja-JP', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {sendMessageMutation.isPending && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#34C759]/10 rounded-full flex items-center justify-center">
              <Bot className="text-[#34C759]" size={16} />
            </div>
            <div className="bg-white dark:bg-[#262626] p-4 rounded-2xl shadow-sm dark:shadow-none dark:ring-1 dark:ring-gray-700">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-800">
        <div className="flex space-x-3">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="AIアシスタントに質問してください..."
            rows={1}
            className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#34C759] resize-none"
            style={{ minHeight: '52px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || sendMessageMutation.isPending}
            className="px-6 py-3 bg-[#34C759] text-white rounded-xl font-medium hover:bg-[#28A745] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Send size={18} />
            <span className="hidden sm:inline">送信</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Enterキーで送信、Shift+Enterで改行
        </p>
      </div>
    </div>
  );
}