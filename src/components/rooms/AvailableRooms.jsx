import { useState, useEffect, useRef } from 'react';
import { FiUsers, FiClock, FiBookOpen } from 'react-icons/fi';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // change if different

export default function AvailableRooms({ onJoinRoom }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    // 1) initial fetch
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/rooms`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    // 2) open socket and listen for realtime events
    socketRef.current = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to socket:', socket.id);
    });

    // when backend emits a newly created room
    socket.on('room-created', (newRoom) => {
      try {
        // Normalize ID field(s)
        const id = newRoom._id || newRoom.id || newRoom.roomId;
        if (!id) return;

        // Avoid duplicates: if room already exists, skip
        setRooms((prev) => {
          const exists = prev.some(r => (r._id || r.id) === id);
          if (exists) return prev;
          // add new room to top
          return [newRoom, ...prev];
        });
      } catch (err) {
        console.error('Error handling room-created', err);
      }
    });

    // optional: server may emit room-updated or room-closed events — handle them
    socket.on('room-updated', (updatedRoom) => {
      const id = updatedRoom._id || updatedRoom.id;
      if (!id) return;
      setRooms(prev => prev.map(r => ((r._id || r.id) === id ? { ...r, ...updatedRoom } : r)));
    });

    socket.on('room-closed', ({ roomId }) => {
      if (!roomId) return;
      // mark the room as closed or remove from list
      setRooms(prev => prev.filter(r => (r._id || r.id) !== roomId));
    });


    // cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('room-created');
        socketRef.current.off('room-updated');
        socketRef.current.off('room-closed');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [onJoinRoom]); // no need to re-run

  // --- rest of your component remains identical ---
  const handleJoinRoom = (roomId) => { onJoinRoom(roomId); };

  const getTimeRemaining = (expiresAt) => {
    if (!expiresAt) return 'No expiry';
    const expires = (typeof expiresAt === 'string' || typeof expiresAt === 'number')
      ? new Date(expiresAt) : (expiresAt instanceof Date ? expiresAt : new Date(expiresAt));
    if (!expires || isNaN(expires.getTime())) return 'No expiry';
    const diffMs = expires.getTime() - Date.now();
    if (diffMs <= 0) return 'Expired';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m left`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m left`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-4">Available Study Rooms</h2>
        <p className="text-purple-500">Loading rooms...</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-4">Available Study Rooms</h2>
        <p className="text-purple-500">No rooms available. Create one to get started!</p>
      </div>
    );
  }
  function getLocalUser() {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }
  const localUser = getLocalUser();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-purple-900 mb-4">Available Study Rooms</h2>
      <div className="space-y-3">
        {rooms.map((room) => {
          const title = room.title || room.room_name || 'Untitled Room';
          const subject = room.subject || room.topic || '';
          const expiresAt = room.expiresAt || room.expires_at || room.expires || null;
          let memberCount = 1;
          if (typeof room.member_count === 'number') memberCount = room.member_count;
          else if (Array.isArray(room.members)) memberCount = room.members.length;
          else if (room.members_count) memberCount = Number(room.members_count) || 1;

          let createdByUsername = null;
          if (room.created_by_user && typeof room.created_by_user === 'object') {
            createdByUsername = room.created_by_user.username || room.created_by_user.name || null;
          } else if (room.created_by_user && typeof room.created_by_user === 'string') {
            createdByUsername = room.created_by_user;
          } else if (room.createdBy && typeof room.createdBy === 'string') {
            createdByUsername = room.createdBy;
          } else if (room.createdBy && typeof room.createdBy === 'object') {
            createdByUsername = room.createdBy.username || room.createdBy.name || null;
          } else if (room.created_by && typeof room.created_by === 'string') {
            createdByUsername = room.created_by;
          }

          return (
            <div
              key={room._id || room.id || title}
              className="border border-purple-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 mb-1">{title}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-purple-600">
                    {subject && (
                      <div className="flex items-center gap-1">
                        <FiBookOpen size={16} />
                        <span>{subject}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1">
                      <FiUsers size={16} />
                      <span>{memberCount}/7 members</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <FiClock size={16} />
                      <span>{getTimeRemaining(expiresAt)}</span>
                    </div>
                  </div>

                  {createdByUsername && (
                    <p className="text-xs text-purple-500 mt-2">
                      Created by @
                      {
                        // if this room was created by the current user
                        room.createdBy === localUser.userId
                          ? localUser.username
                          : room.created_by_user?.username || "anonymous"
                      }
                    </p>

                  )}
                </div>

                <button
                  onClick={() => handleJoinRoom(room._id || room.id)}
                  className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
                >
                  Join
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
