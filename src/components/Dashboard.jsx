import { useState } from 'react';
import AIChat from '../components/ai/AiChat';
import CreateRoomModal from '../components/rooms/CreateRoomModel';
import AvailableRooms from '../components/rooms/AvailableRooms';
import RoomChat from '../components/rooms/RoomChat';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiPlus, FiMessageSquare, FiUsers } from 'react-icons/fi';


export default function Dashboard() {
  const navigate = useNavigate();

  const profile = {
    full_name: 'Osita Dimma',
    username: 'Osita',
    school_name: 'PurpleSchool',
    class_level: 'SS2',
    state: 'Lagos',
  };

  const [view, setView] = useState('ai-chat'); // 'ai-chat' | 'room-chat'
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleJoinRoom = (roomId) => {
    setCurrentRoomId(roomId);
    setView('room-chat');
  };

  const handleLeaveRoom = () => {
    setCurrentRoomId(null);
    setView('ai-chat');
  };

  const handleRoomCreated = (roomId) => {
    setShowCreateModal(false);
    handleJoinRoom(roomId);
  };

  const handleSignOut = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="px-4 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
              <FiMessageSquare className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-gray-900">PurpleSchool</h1>
              <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">
                AI-Powered Learning Platform
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="text-right hidden md:block">
              <p className="font-medium text-gray-900">{profile.full_name}</p>
              <p className="text-sm text-gray-600">@{profile.username}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Sign out"
            >
              <FiLogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <aside className="lg:w-80 bg-white border-b lg:border-r lg:border-b-0 shadow-sm flex flex-col">
          <div className="p-3 lg:p-4 border-b flex gap-2 lg:block">
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 lg:w-full flex items-center justify-center gap-2 bg-green-600 text-white px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-sm lg:text-base font-medium hover:bg-green-700 transition-colors"
            >
              <FiPlus size={18} />
              <span className="hidden sm:inline">Create Study Room</span>
              <span className="sm:hidden">Create Room</span>
            </button>
            <button
              onClick={() => {
                setView('ai-chat');
                setCurrentRoomId(null);
              }}
              className={`flex-1 lg:hidden flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                view === 'ai-chat' && !currentRoomId
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FiMessageSquare size={18} />
              <span>AI Chat</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 lg:p-4 hidden lg:block">
            <div className="space-y-3 lg:space-y-4">
              <button
                onClick={() => {
                  setView('ai-chat');
                  setCurrentRoomId(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 lg:py-3 rounded-lg transition-colors ${
                  view === 'ai-chat' && !currentRoomId
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiMessageSquare size={20} />
                <span>AI Learning Assistant</span>
              </button>

              <div className="pt-3 lg:pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2 uppercase tracking-wide flex items-center gap-2">
                  <FiUsers size={16} />
                  Available Rooms
                </h3>
                <AvailableRooms onJoinRoom={handleJoinRoom} />
              </div>
            </div>
          </div>

          <div className="p-3 lg:p-4 border-t bg-gray-50 hidden lg:block">
            <div className="text-xs text-gray-600 space-y-1">
              <p>
                <span className="font-medium">School:</span> {profile.school_name}
              </p>
              <p>
                <span className="font-medium">Class:</span> {profile.class_level}
              </p>
              <p>
                <span className="font-medium">State:</span> {profile.state}
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">
          {view === 'ai-chat' && !currentRoomId && <AIChat />}
          {view === 'room-chat' && currentRoomId && (
            <RoomChat roomId={currentRoomId} onLeaveRoom={handleLeaveRoom} />
          )}
        </main>
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={handleRoomCreated}
        />
      )}
    </div>
  );
}
