import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

const clearStoredAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
};

const isJwtExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 <= Date.now() : false;
  } catch {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser || storedUser === "undefined") return null;
      return JSON.parse(storedUser);
    } catch (err) {
      console.error("Failed to parse user from localStorage:", err);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    setUser(null);
    clearStoredAuth();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isJwtExpired(token)) {
      logout();
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
        if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
      })
      .catch((err) => {
        if (err.response?.status === 401) logout();
      })
      .finally(() => setLoading(false));
  }, []);

  const register = async (data) => {
    const payload = { ...data };
    const adminEmails = ["adminm@yegara.com", "owner@yegara.com"];
    if (adminEmails.includes(data.email)) {
      payload.secret = "MY_SUPER_SECRET_KEY_2025";
    }

    const res = await axios.post(`${API_URL}/api/users/register`, payload);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
    setUser(res.data.user);
    return res;
  };

  const login = async (data) => {
    const res = await axios.post(`${API_URL}/api/users/login`, data);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
    setUser(res.data.user);
    return res;
  };

  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token || isJwtExpired(token)) {
      logout();
      return null;
    }

    try {
      const res = await axios.get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
      return res.data.user;
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) logout();
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
