import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

export default function OTPVerification({ email, onSuccess }) {
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await verifyOTP(email, otp);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Verification failed');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <CheckCircle className="text-blue-600" size={32} />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Verify Your Email</h2>
      <p className="text-gray-600 text-center mb-6">
        We've sent a 6-digit code to <span className="font-medium">{email}</span>
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP Code</label>
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Check your console for the OTP code (development mode)
      </p>
    </div>
  );
}
