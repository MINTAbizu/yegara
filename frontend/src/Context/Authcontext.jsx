import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
        setUser(res.data.user);   // <-- FIXED
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Register
 const register = async (data) => {
  let payload = { ...data };

  // Auto-detect admin emails
  const adminEmails = ["adminm@yegara.com", "owner@yegara.com"];

  if (adminEmails.includes(data.email)) {
    payload.secret = "MY_SUPER_SECRET_KEY_2025"; // Must match backend .env
  }

  const res = await axios.post(`${API_URL}/api/users/register`, payload);
  // const res = await axios.post(  "http://localhost:5000/api/users/register", payload);

  localStorage.setItem("token", res.data.token);
  setUser(res.data.user);

  return res;
};


  // Login
  const login = async (data) => {
    const res = await axios.post(
     ` ${API_URL}/api/users/login`,
    // "http://localhost:5000/api/users/login",
      data
    );

    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);

    return res;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  // Authcontext.jsx
// const refreshUser = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) return;

//   try {
//     const res = await axios.get("http://localhost:5000/api/users/me", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUser(res.data);
//     console.debug('refreshUser result:', res.data);
//     return res.data;
//   } catch (err) {
//     console.error(err);
//     setUser(null);
//   }
// };
const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(
      `${API_URL}/api/users/me`,
      // "http://localhost:5000/api/users/me",
       {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(res.data.user);  // <-- FIXED
    return res.data.user;
  };



  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout,refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
