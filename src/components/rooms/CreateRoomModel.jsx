import { useState } from 'react';
import { FiX } from 'react-icons/fi';

export default function CreateRoomModal({ onClose, onRoomCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load username from localStorage (simple)
  const createdBy = localStorage.getItem("username") || "anonymous";

  const [formData, setFormData] = useState({
    room_name: '',
    subject: '',
    duration_minutes: 60,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.room_name.trim()) {
      setError("Room name is required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://purpleschoolbackend.onrender.com/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.room_name,
          subject: formData.subject,
          createdBy: createdBy,
          expiresInMinutes: formData.duration_minutes,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to create room");
      }

      const room = await response.json();

      // return room ID to parent
      onRoomCreated(room._id);

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };


  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-900">Create Study Room</h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room Name */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Room Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Physics Exam Prep"
              value={formData.room_name}
              onChange={(e) =>
                setFormData({ ...formData, room_name: e.target.value })
              }
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">Subject (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Mathematics, Chemistry"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-purple-700 mb-1">
              Duration (minutes, max 120)
            </label>
            <input
              type="number"
              required
              min={15}
              max={120}
              value={formData.duration_minutes}
              onChange={(e) =>
                setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-purple-300 text-purple-700 rounded-lg font-medium hover:bg-purple-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Room'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
