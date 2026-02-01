import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpgradeProCard = ({ currentUser, refreshUser }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/upgrade-pro`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upgrade failed");

      toast.success("🎉 Account upgraded to Pro!");
      refreshUser(); // update AuthContext
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-xl shadow-lg transition hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white max-w-sm mx-auto">
      <h2 className="text-xl font-bold mb-2">Upgrade to Pro</h2>
      <p className="mb-4">
        Unlock premium features and badges for your account!
      </p>
      <button
        className={`w-full py-2 rounded-lg font-bold ${
          currentUser.role === "pro"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-white text-purple-600 hover:bg-purple-100"
        }`}
        onClick={handleUpgrade}
        disabled={currentUser.role === "pro" || loading}
      >
        {currentUser.role === "pro" ? "Already Pro" : loading ? "Upgrading..." : "Upgrade to Pro"}
      </button>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UpgradeProCard;
