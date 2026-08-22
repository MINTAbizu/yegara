import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const initTelegramUser = async () => {
  const tg = window.Telegram?.WebApp;
  if (!tg || !tg.initData) return null;

  tg.ready();
  tg.expand(); // Opens full height in Telegram

  try {
    // Send Telegram initData to your Express backend for validation
    const res = await axios.post(`${API_URL}/api/auth/telegram-login`, {
      initData: tg.initData,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      return res.data.user;
    }
  } catch (err) {
    console.error("Telegram auth failed", err);
  }
  return null;
};