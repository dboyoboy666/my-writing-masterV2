'use client';

import { useChat } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import { Send } from 'lucide-react';

export default function Home() {
  // 关键修正点：必须在这里把 handleSubmit 解构出来！
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    api: '/api/chat', // 确保指向正确的后端路由
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部标题栏 */}
      <header className="p-4 bg-white border-b shadow-sm z-10">
        <h1 className="text-lg font-bold text-center text-gray-800">
          我的随身写作大师 ✍️
        </h1>
      </header>

      {/* 中间聊天区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            <p>你好呀！我是你的写作指导专家。</p>
            <p className="text-sm">把你的作文创意或初稿发给我吧！</p>
          </div>
        )}

        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
              }`}
            >
              {m.role === 'user' ? (
                // 用户消息直接显示文本
                <p className="whitespace-pre-wrap">{m.content}</p>
              ) : (
                // AI 消息使用 Markdown 渲染
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-li:my-0">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* 错误提示回显 */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            出错了：{error.message} (请检查 API Key 或网络)
          </div>
        )}
      </div>

      {/* 底部输入框 */}
      <div className="p-4 bg-white border-t sticky bottom-0">
        <form
          onSubmit={handleSubmit} // 修正点：直接传递 handleSubmit，不要包一层
          className="relative flex items-end gap-2"
        >
          <textarea
            className="flex-1 min-h-[44px] max-h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入作文内容或创意..."
            value={input}
            onChange={handleInputChange}
            rows={1}
            // 简单的自动高度调整逻辑（可选）
            onInput={(e) => {
              e.currentTarget.style.height = 'auto';
              e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
            }}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}