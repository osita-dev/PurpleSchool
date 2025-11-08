import { createContext, useContext, useState, useEffect } from 'react';

// Simple AuthContext for UI-only mode (no backend)
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false); // can set true if you want a loading UI

  // Fake effect to simulate loading user/profile for UI
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setUser(null); // no user logged in for now
      setProfile(null);
      setLoading(false);
    }, 500); // simulate short delay
    return () => clearTimeout(timer);
  }, []);

  // Stubbed functions for now, do nothing but keep interface
  const signUp = async (email, password, profileData) => ({ success: true });
  const verifyOTP = async (email, otp) => ({ success: true });
  const signIn = async (email, password) => ({ success: true });
  const signOut = async () => {};
  const refreshProfile = async () => {};

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signUp, verifyOTP, signIn, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
