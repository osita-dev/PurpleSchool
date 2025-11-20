import { useState, useEffect } from 'react';
import { FiUsers, FiClock, FiBookOpen } from 'react-icons/fi';

export default function AvailableRooms({ onJoinRoom }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/rooms'); // fetch from backend
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleJoinRoom = (roomId) => {
    onJoinRoom(roomId);
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins}m left`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m left`;
    }
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-purple-900 mb-4">Available Study Rooms</h2>
      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="border border-purple-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">{room.room_name}</h3>

                <div className="flex flex-wrap items-center gap-3 text-sm text-purple-600">
                  {room.subject && (
                    <div className="flex items-center gap-1">
                      <FiBookOpen size={16} />
                      <span>{room.subject}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1">
                    <FiUsers size={16} />
                    <span>{room.member_count}/7 members</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <FiClock size={16} />
                    <span>{getTimeRemaining(room.expires_at)}</span>
                  </div>
                </div>

                {room.created_by_user && (
                  <p className="text-xs text-purple-500 mt-2">
                    Created by @{room.created_by_user.username}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleJoinRoom(room._id)}
                className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
              >
                Join
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
