import React from 'react';

const MODES = [
  { key: 'exam', label: 'Preparing for Exam' },
  { key: 'intense', label: 'Intense Study' },
  { key: 'chitchat', label: 'ChitChat' },
];

export default function StudyModeModal({ open, initialSelected = [], onClose, onStart }) {
  const [selected, setSelected] = React.useState(() => {
    return new Set(initialSelected);
  });

  React.useEffect(() => {
    if (open) {
      setSelected(new Set(initialSelected));
    }
  }, [open, initialSelected]);

  if (!open) return null;

  // 🔥 Only ONE option at a time
  const toggle = (key) => {
    setSelected(prev => {
      // If the clicked one was selected → deselect all
      if (prev.has(key)) {
        return new Set();
      }

      // Otherwise → select ONLY this one
      return new Set([key]);
    });
  };

  const handleStart = () => {
    onStart(Array.from(selected));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-xl mx-4 bg-white rounded-lg shadow-lg overflow-hidden">

        <div className="px-6 py-5 border-b border-purple-300">
          <h2 className="text-lg font-semibold text-purple-900">Why do you want to chat with Purple?</h2>
          <p className="text-sm text-purple-500 mt-1">
            Pick one — Purple will tailor responses accordingly.
          </p>
        </div>

        <div className="px-6 py-4">
          <div className="space-y-3">
            {MODES.map(mode => (
              <label
                key={mode.key}
                className="flex items-center gap-3 p-2 rounded hover:bg-purple-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selected.has(mode.key)}
                  onChange={() => toggle(mode.key)}
                  className="w-4 h-4"
                />

                <div className="flex flex-col">
                  <span className="font-medium text-purple-900">{mode.label}</span>

                  <span className="text-xs text-purple-500">
                    {mode.key === 'exam' && 'Focused practice & past-paper style help.'}
                    {mode.key === 'intense' && 'Deeper explanations and study plans.'}
                    {mode.key === 'chitchat' && 'Casual conversation and simple examples.'}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-purple-300 flex items-center justify-end gap-3 bg-purple-50">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg text-sm text-purple-500 hover:bg-purple-100"
          >
            Skip
          </button>

          <button
            onClick={handleStart}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            Start
          </button>
        </div>

      </div>
    </div>
  );
}
