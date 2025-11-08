import { useState, useEffect, useRef } from 'react';
import { FiSend, FiLoader, FiZap } from 'react-icons/fi';

export default function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      content: input.trim(),
      is_ai_message: false,
      ai_source: null,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        content: `Great question about "${userMessage.content}"!\n\nHere's a structured explanation:\n\n1. Introduction\n2. Key Concepts\n3. Examples\n4. Applications\n5. Summary`,
        is_ai_message: true,
        ai_source: 'Simulated AI',
      };
      setMessages((prev) => [...prev, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-md">
        <div className="flex items-center gap-2">
          <FiZap size={24} />
          <div>
            <h2 className="text-xl font-bold">AI Learning Assistant</h2>
            <p className="text-sm text-blue-100">Ask me anything about your studies</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <FiZap className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Learning</h3>
            <p className="text-gray-600">Ask me to explain any topic, solve problems, or prepare for exams</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.is_ai_message ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.is_ai_message
                  ? 'bg-white border border-gray-200 shadow-sm'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {message.is_ai_message && (
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-blue-600">
                  <FiZap size={16} />
                  AI Assistant
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
              {message.is_ai_message && message.ai_source && (
                <div className="mt-2 text-xs text-gray-500">Source: {message.ai_source}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center gap-2 text-blue-600">
              <FiLoader className="animate-spin" size={20} />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything... e.g., explain organic chemistry"
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center gap-2"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
