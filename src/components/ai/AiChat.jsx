import { useState, useRef, useEffect } from 'react';
import { FiSend, FiLoader, FiZap } from 'react-icons/fi';
import { FaTrash } from "react-icons/fa"; // icon
const STORAGE_KEY = 'ai_conversation_v1'; // change if you want multiple keys or versions

export default function AiChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch (err) {
      console.warn('Failed reading chat from localStorage', err);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (err) {
      console.warn('Failed saving chat to localStorage', err);
    }
    scrollToBottom();
  }, [messages]);

  // Optional: sync across tabs/windows
  useEffect(() => {
    const handler = (ev) => {
      if (ev.key === STORAGE_KEY && ev.newValue) {
        try {
          const parsed = JSON.parse(ev.newValue);
          if (Array.isArray(parsed)) setMessages(parsed);
        } catch (e) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      content: input.trim(),
      is_ai_message: false,
      ai_source: null,
    };

    // Optimistic UI: append user message
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch('https://purpleschoolbackend.onrender.com/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.content, recent: messages.slice(-10) }),
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => ({ message: 'AI API error' }));
        throw new Error(errJson.error || errJson.message || 'AI API failed');
      }

      const data = await resp.json();

      const aiMessage = {
        id: Date.now() + 1,
        content: data.reply || data.content || 'No text returned',
        is_ai_message: true,
        ai_source: data.ai_source || 'Gemini',
        parsed: data.parsed || null, // if server returned parsed JSON
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          content: `⚠️ Error: ${err.message}`,
          is_ai_message: true,
          ai_source: 'error',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { }
  };

  return (
    <div className="flex flex-col h-full ">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-800 to-purple-900 text-white p-4 shadow-md">
        {/* bg-gradient-to-r from-white-800 to-white-900 text-white p-4 shadow-md */}
        <div className="flex items-center gap-2 ">
          <FiZap size={24} />
          <div>
             <h2 className="text-xl font-bold">AI Learning Assistant</h2>
            <p className="text-sm text-purple-100">Ask me anything about your studies</p>
          </div>

          {/* optional clear button */}
          <div className="ml-auto">
            <button
              onClick={clearConversation}
              className="text-sm bg-white/10 px-3 py-2 rounded-md hover:bg-white/20"
            >
              <FaTrash size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-purple-50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
              <FiZap className="text-purple-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-purple-900 mb-2">Start Learning</h3>
            <p className="text-purple-600">Ask me to explain any topic, solve problems, or prepare for exams</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.is_ai_message ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] rounded-lg p-4 ${message.is_ai_message ? 'bg-white border border-purple-200 shadow-sm' : 'bg-purple-600 text-white'}`}>
              {message.is_ai_message && message.parsed ? (
                <div>
                  <div className="font-semibold">Introduction</div>
                  <div className="mb-2">{message.parsed.introduction}</div>

                  <div className="font-semibold">Key concepts</div>
                  <ul className="list-disc ml-5 mb-2">
                    {message.parsed.key_concepts.map((k, i) => <li key={i}>{k}</li>)}
                  </ul>

                  <div className="font-semibold">Examples</div>
                  <ul className="list-disc ml-5 mb-2">
                    {message.parsed.examples.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>

                  <div className="font-semibold">Applications</div>
                  <ul className="list-disc ml-5 mb-2">
                    {message.parsed.applications.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>

                  <div className="font-semibold">Summary</div>
                  <div>{message.parsed.summary}</div>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-purple-200 rounded-lg p-4 shadow-sm flex items-center gap-2 text-purple-600">
              <FiLoader className="animate-spin" size={20} />
              <span>AI is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-t-purple-800 bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything... e.g., explain organic chemistry"
            disabled={loading}
            className="flex-1 px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-6 py-2 bg-purple-900 text-white rounded-lg font-medium hover:bg-purple-800 disabled:bg-gray-400 transition-colors flex items-center gap-2"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}