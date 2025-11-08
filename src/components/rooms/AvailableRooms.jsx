import { useState, useEffect } from 'react';
import { FiUsers, FiClock, FiBookOpen } from 'react-icons/fi';

export default function AvailableRooms({ onJoinRoom }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching rooms
    setTimeout(() => {
      setRooms([
        {
          id: 'room1',
          room_name: 'Physics Exam Prep',
          subject: 'Physics',
          member_count: 3,
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          created_by_user: { username: 'janedoe' },
        },
        {
          id: 'room2',
          room_name: 'Chemistry Revision',
          subject: 'Chemistry',
          member_count: 2,
          expires_at: new Date(Date.now() + 120 * 60 * 1000).toISOString(),
          created_by_user: { username: 'johndoe' },
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const handleJoinRoom = (roomId) => {
    // Simulate join action
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Study Rooms</h2>
        <p className="text-gray-500">Loading rooms...</p>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Study Rooms</h2>
        <p className="text-gray-500">No rooms available. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Study Rooms</h2>
      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{room.room_name}</h3>

                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
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
                  <p className="text-xs text-gray-500 mt-2">
                    Created by @{room.created_by_user.username}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleJoinRoom(room.id)}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
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
