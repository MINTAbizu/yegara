import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Safe initialization from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Load user on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // Register
  const register = async (data) => {
    let payload = { ...data };
    const adminEmails = ["adminm@yegara.com", "owner@yegara.com"];
    if (adminEmails.includes(data.email)) {
      payload.secret = "MY_SUPER_SECRET_KEY_2025";
    }

    const res = await axios.post(`${API_URL}/api/users/register`, payload);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);

    return res;
  };

  // Login
  const login = async (data) => {
    const res = await axios.post(`${API_URL}/api/users/login`, data); // ✅ fixed URL
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res;
  };

  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Refresh user (use after KYC/profile update)
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const res = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data.user;
    } catch (err) {
      console.error(err);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
