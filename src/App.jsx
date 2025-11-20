import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import Dashboard from './components/Dashboard';
import ProtectedRouteLocal from './utils/ProtectedRoutes';
// import PageNotFound from './components/PageNotFound';
 // simple 404 component

function App() {
  const [loading, setLoading] = useState(true);

  // simulate initial loading
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 150);
    return () => clearTimeout(t);
  }, []);

  // show loading spinner if app is "initializing"
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Auth pages */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<ProtectedRouteLocal>
          
          <Dashboard />
          </ProtectedRouteLocal>
          } />

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login"/>} />

        {/* Catch-all 404 */}
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
