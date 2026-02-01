import React, { useState } from "react";
import { useAuth } from "../Context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import { FaStar, FaRocket, FaLock } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const UpgradePro = () => {
  const { user, refreshUser, token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/upgrade-pro`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("🎉 Your account is now Pro!");
        await refreshUser(); // update user info in context
      } else {
        toast.error(result.message || "Upgrade failed!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error!");
    } finally {
      setLoading(false);
    }
  };

  // Define Pro perks
  const perks = [
    { icon: <FaStar />, title: "Priority Support", color: "#FF6B6B" },
    { icon: <FaRocket />, title: "Faster Transactions", color: "#6C5DD3" },
    { icon: <FaLock />, title: "Enhanced Security", color: "#FFD93D" },
  ];

  return (
    <div className="container my-5">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-center mb-4">Upgrade to Pro Account</h2>
      <p className="text-center mb-4">
        Unlock exclusive perks and enjoy a premium experience!
      </p>

      <div className="row g-4 mb-4">
        {perks.map((perk, index) => (
          <div key={index} className="col-12 col-sm-6 col-md-4">
            <div
              className="card text-white text-center p-4 shadow-lg border-0"
              style={{
                backgroundColor: perk.color,
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
              }}
            >
              <div className="fs-2 mb-2">{perk.icon}</div>
              <div className="fw-bold">{perk.title}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          className="btn btn-warning btn-lg"
          onClick={handleUpgrade}
          disabled={user.role === "pro" || loading}
        >
          {loading
            ? "Upgrading..."
            : user.role === "pro"
            ? "Already Pro"
            : "Upgrade to Pro"}
        </button>
      </div>
    </div>
  );
};

export default UpgradePro;
