import React, { useState } from "react";
import { useAuth } from "../Context/Authcontext";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const UpgradePro = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Loading user info...</p>; // user not loaded yet

  const handleUpgrade = async () => {
    if (user.role === "pro") {
      toast.info("You are already a Pro user!");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in!");
        return;
      }

      const res = await fetch(`${API_URL}/api/users/upgrade-pro`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Account upgraded to Pro successfully!");
        await refreshUser(); // refresh context user info
      } else {
        toast.error(result.message || "Upgrade failed!");
      }
    } catch (err) {
      console.error("UpgradePro error:", err);
      toast.error("Server error!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: 500 }}>
        <h2 className="mb-3 text-center">Upgrade to Pro</h2>
        <p>
          Current role: <strong>{user.role}</strong>
        </p>
        <button
          className="btn btn-success w-100"
          onClick={handleUpgrade}
          disabled={user.role === "pro" || loading}
        >
          {loading
            ? "Processing..."
            : user.role === "pro"
            ? "Already Pro"
            : "Upgrade to Pro"}
        </button>
      </div>
    </div>
  );
};

export default UpgradePro;
