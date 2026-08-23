import axios from "axios";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export const getTelegramWebApp = () => window.Telegram?.WebApp || null;

export const isTelegramMiniApp = () => Boolean(getTelegramWebApp()?.initData);

export const initTelegramUser = async () => {
  const tg = getTelegramWebApp();
  if (!tg?.initData) return null;

  tg.ready();
  tg.expand();

  const res = await axios.post(`${API_URL}/api/auth/telegram-login`, {
    initData: tg.initData,
  });

  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    if (res.data.user?.role) localStorage.setItem("role", res.data.user.role);
    return res.data.user;
  }

  return null;
};
