import { Navigate } from 'react-router-dom';

export default function ProtectedRouteLocal({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
