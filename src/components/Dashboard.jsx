import { useState, useEffect } from 'react';
import AIChat from '../components/ai/AiChat';
import CreateRoomModal from '../components/rooms/CreateRoomModel';
import AvailableRooms from '../components/rooms/AvailableRooms';
import RoomChat from '../components/rooms/RoomChat';
import StudyModeModal from '../components/StudyModeModal';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiPlus, FiMessageSquare, FiUsers } from 'react-icons/fi';

// LocalStorage Keys (clean constant style)
const STUDY_MODE_KEY = 'purple_study_mode_v1';
const STUDY_MODE_DONE_KEY = 'purple_study_mode_done_v1';
// const CREATE_ROOM_DONE_KEY = 'createRoomPopupClosed_v1';

export default function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    school_name: '',
    class_level: '',
    state: '',
  });


  const [view, setView] = useState('ai-chat'); // 'ai-chat' | 'room-chat'
  const [currentRoomId, setCurrentRoomId] = useState(null);

  // Create Room modal (kept simple; show only when false in LS)
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Study modal: show only if user hasn't completed it before
  const [showStudyModal, setShowStudyModal] = useState(() => {
    return localStorage.getItem(STUDY_MODE_DONE_KEY) !== 'true';
  });

  // persisted selected modes
  const [studyModes, setStudyModes] = useState(() => {
    const saved = localStorage.getItem(STUDY_MODE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    // hide study modal when user switches away from ai-chat or enters a room
    if (view !== 'ai-chat' || currentRoomId) setShowStudyModal(false);

    // show modal again if user returns to ai-chat and hasn't chosen modes yet
    if (view === 'ai-chat' && !currentRoomId && studyModes.length === 0) {
      const done = localStorage.getItem(STUDY_MODE_DONE_KEY) === 'true';
      if (!done) setShowStudyModal(true);
    }
    // we only need to watch these
  }, [view, currentRoomId, studyModes.length]);

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

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem('token');

      // optional: notify server to blacklist token
      if (token) {
        await fetch('http://localhost:5000/api/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }

      // clear all relevant localStorage items
      localStorage.removeItem('token');
      localStorage.removeItem('profile');
      localStorage.removeItem('user');
      localStorage.removeItem('ai_conversation_v1');
      localStorage.removeItem(STUDY_MODE_KEY);
      localStorage.removeItem(STUDY_MODE_DONE_KEY);

      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error logging out:', err);
      navigate('/login', { replace: true });
    }
  };

  // --- IMPORTANT: persist modes + done flag when user clicks Start ---
  const handleStartWithModes = (modesArray) => {
    const modes = Array.isArray(modesArray) ? modesArray : [];
    // persist chosen modes
    try {
      localStorage.setItem(STUDY_MODE_KEY, JSON.stringify(modes));
      localStorage.setItem(STUDY_MODE_DONE_KEY, 'true');
    } catch (err) {
      console.warn('Could not write study modes to localStorage', err);
    }
    setStudyModes(modes);
    setShowStudyModal(false);
    setView('ai-chat');
    setCurrentRoomId(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token'); // assume user already has it
        if (!token) return;

        const res = await fetch('http://localhost:5000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        setProfile(data);
        localStorage.setItem('profile', JSON.stringify(data));
      } catch (err) {
        console.error('Could not load user info', err);
      }
    };

    const stored = localStorage.getItem('profile');
    if (stored) setProfile(JSON.parse(stored));
    else fetchUser();
  }, []);



  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-b-purple-800 shadow-sm">
        <div className="px-4 py-3 lg:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-purple-800 to-purple-900 rounded-lg flex items-center justify-center">
              <FiMessageSquare className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg lg:text-2xl font-bold text-purple-900">PurpleSchool</h1>
              <p className="text-xs lg:text-sm text-purple-600 hidden sm:block">
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
              className="p-2 text-purple-600 hover:text-purple-900 hover:bg-purple-100 rounded-lg transition-colors"
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
        <aside className="lg:w-80 bg-white border-b-2 border-b-purple-700 lg:border-r-2 lg:border-r-purple-700 shadow-sm flex flex-col">
          <div className="p-3 lg:p-4 border-b-2 border-b-purple-700 flex gap-2 lg:block">
            
                <button
                  onClick={() => {
                    // user manually opens create room: reset stored closed flag so it can show normally next time
                    // localStorage.setItem(CREATE_ROOM_DONE_KEY, 'false');
                    setShowCreateModal(true);
                  }}
                  className="flex-1 lg:w-full flex items-center justify-center gap-2 bg-purple-900 text-white px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg text-sm lg:text-base font-medium hover:bg-purple-700 transition-colors"
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
                  className={`flex-1 lg:hidden flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${view === 'ai-chat' && !currentRoomId
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 lg:py-3 rounded-lg transition-colors ${view === 'ai-chat' && !currentRoomId
                      ? 'bg-purple-50 text-purple-700 font-medium'
                      : 'text-purple-700 hover:bg-purple-50'
                      }`}
                  >
                    <FiMessageSquare size={20} />
                    <span>AI Learning Assistant</span>
                  </button>

                  <div className="pt-3 lg:pt-4 border-t border-t-purple-700">
                    <h3 className="text-sm font-semibold text-purple-500 mb-3 px-2 uppercase tracking-wide flex items-center gap-2">
                      <FiUsers size={16} />
                      Available Rooms
                    </h3>
                    <AvailableRooms onJoinRoom={handleJoinRoom} />
                  </div>
                </div>
              </div>

              <div className="p-3 lg:p-4 border-t bg-purple-50 hidden lg:block">
                <div className="text-xs text-purple-600 space-y-1">
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
            <main className="flex-1 overflow-hidden relative">
              {/* pass studyModes to AIChat so it can build the system prompt */}
              {view === 'ai-chat' && !currentRoomId && <AIChat studyModes={studyModes} />}

              {view === 'room-chat' && currentRoomId && (
                <RoomChat roomId={currentRoomId} onLeaveRoom={handleLeaveRoom} />
              )}

              {/* Study Mode Modal (uses your existing modal component) */}
              <StudyModeModal
                open={showStudyModal && view === 'ai-chat' && !currentRoomId}
                initialSelected={studyModes}
                onClose={() => {
                  // user clicked Skip or closed modal: mark done so it won't show again
                  try { localStorage.setItem(STUDY_MODE_DONE_KEY, 'true'); } catch (e) { }
                  setShowStudyModal(false);
                }}
                onStart={handleStartWithModes}
              />
            </main>
          </div>

          {/* Create Room Modal */}
          {showCreateModal && (
            <CreateRoomModal
              onClose={() => {
                setShowCreateModal(false);
              }}
              onRoomCreated={handleRoomCreated}
            />
          )}
      </div>
      );
}
