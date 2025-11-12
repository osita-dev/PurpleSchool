import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

// create the context
const AuthContext = createContext();

// custom hook for easy access
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null); // {type:'success'|'error', message:''}

  // utility for showing notifications
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // SIGNUP
  const signupUser = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");
      showNotification("success", "Account created successfully!");
      navigate("/login");
    } catch (err) {
      showNotification("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // LOGIN
  const loginUser = async (formData) => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Invalid credentials");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setToken(data.token);
      showNotification("success", "Logged in successfully!");
      navigate("/dashboard");
    } catch (err) {
      showNotification("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        notification,
        signupUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}

      {/* ✅ Tailwind notification box */}
      {notification && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg border shadow-md transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-red-100 text-red-700 border-red-300"
          }`}
        >
          {notification.message}
        </div>
      )}
    </AuthContext.Provider>
  );
};
export { AuthContext };