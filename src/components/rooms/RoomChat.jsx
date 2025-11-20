import { useState, useEffect, useRef } from 'react';
import { FiSend, FiMic, FiArrowLeft, FiUsers, FiShield, FiAlertTriangle, FiVideo } from 'react-icons/fi';

export default function RoomChat({ roomId, onLeaveRoom }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [roomInfo, setRoomInfo] = useState(null);
  const [members, setMembers] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Mock room info
    setRoomInfo({ room_name: 'Physics Exam Prep', subject: 'Physics' });
    // Mock members
    setMembers([
      { id: 1, username: 'janedoe' },
      { id: 2, username: 'johndoe' },
    ]);
    // Mock messages
    setMessages([
      { id: 1, user: { username: 'janedoe' }, content: 'Hello everyone!', timestamp: new Date() },
      { id: 2, user: { username: 'johndoe' }, content: 'Hi! Ready to study?', timestamp: new Date() },
    ]);
  }, [roomId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMsg = {
      id: Date.now(),
      user: { username: 'You' },
      content: input.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  const handleVoiceNote = () => {
    setIsRecording(!isRecording);
    alert('Voice note feature coming soon!');
  };

  const handleStartVideoCall = () => setShowVideoCall(true);
  const handleEndVideoCall = () => setShowVideoCall(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (showVideoCall && roomInfo) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-100">
        <h2 className="text-xl font-bold mb-4">Video Call with {roomInfo.room_name}</h2>
        <button
          onClick={handleEndVideoCall}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          End Call
        </button>
      </div>
    );
  }

  useEffect(() => {
    // Set flag to indicate RoomChat is active
    localStorage.setItem('persistRoomChat', 'true');

    // Optional: remove flag when unmounting
    return () => {
      localStorage.removeItem('persistRoomChat');
    };
  }, []);


  return (
    <div className="flex flex-col h-full bg-white">
      {/* Room header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onLeaveRoom}
              className="p-1 hover:bg-green-500 rounded-lg transition-colors"
            >
              <FiArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold">{roomInfo?.room_name}</h2>
              <div className="flex items-center gap-2 text-sm text-green-100">
                <FiUsers size={16} />
                <span>{members.length} members</span>
                {roomInfo?.subject && (
                  <>
                    <span>•</span>
                    <span>{roomInfo.subject}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartVideoCall}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-400 rounded-lg transition-colors text-white text-sm font-medium"
              title="Start video call"
            >
              <FiVideo size={18} />
              <span className="hidden sm:inline">Video Call</span>
            </button>
            <div className="flex items-center gap-2 text-green-100 text-sm">
              <FiShield size={18} />
              <span className="hidden sm:inline">AI Moderated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((message) => {
          const isOwnMessage = message.user.username === 'You';
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${isOwnMessage
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 shadow-sm'
                  }`}
              >
                {!isOwnMessage && message.user && (
                  <div className="font-semibold text-sm mb-1 text-green-600">
                    {message.user.username}
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${isOwnMessage ? 'text-green-100' : 'text-gray-500'}`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2 border-t bg-white p-4">
        <button
          type="button"
          onClick={handleVoiceNote}
          className={`p-3 rounded-lg transition-colors ${isRecording
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <FiMic size={20} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading || isRecording}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading || isRecording}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:bg-green-400 transition-colors flex items-center gap-2"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
}
