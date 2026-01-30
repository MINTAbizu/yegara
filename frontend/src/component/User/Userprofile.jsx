import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaEnvelope,
  FaEye,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const CombinedUsers = () => {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const limit = 10;

  // 🔹 Fetch users + approved profiles
  const fetchData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      const usersRes = await axios.get(
        `${API_URL}/api/users/ouruser?page=1&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const profilesRes = await axios.get(
        `${API_URL}/api/profile/approved?page=1&limit=${limit}`
      );

      setUsers(usersRes.data.users || []);
      console.log("Fetched users:", usersRes.data.users || []);

      setProfiles(profilesRes.data || []);
      console.log("Fetched approved profiles:", profilesRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔗 MERGE: ONLY approved profiles + username from users API
  useEffect(() => {
    if (!users.length || !profiles.length) return;

    const merged = profiles
      .map((profile) => {
        const user = users.find(
          (u) => u._id === profile.user?._id
        );

        if (!user) return null;

        return {
          ...profile,            // profile data (approved only)
          userId: user._id,
          name: user.name,       // ✅ from users API
          email: user.email,
          badges: user.badges || [],
        };
      })
      .filter(Boolean);

    setMergedData(merged);
  }, [users, profiles]);

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", height: 200 }}>
        <ClipLoader size={60} />
      </div>
    );
  }

  return (
    <>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>
        Verified Users
      </h1>

      <div
        style={{
          padding: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
        }}
      >
        {mergedData.map((u) => (
          <div
            key={u._id}
            style={{
              width: 280,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 0 10px rgba(0,0,0,0.15)",
              textAlign: "center",
              background: "#fff",
            }}
          >
            {/* Background */}
            <img
              src={u.backgroundImage || "https://via.placeholder.com/400x200"}
              alt="background"
              style={{ width: "100%", height: 120, objectFit: "cover" }}
            />

            {/* Avatar */}
            <img
              src={u.avatar || "https://via.placeholder.com/200"}
              alt={u.name}
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                marginTop: -50,
                border: "5px solid white",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: 12 }}>
              <h3 style={{ marginBottom: 4 }}>{u.name}</h3>

              {/* 🏷️ BADGES */}
              {u.badges.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 6,
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  {u.badges.map((badge, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        padding: "2px 8px",
                        fontSize: 12,
                        borderRadius: 12,
                        background: "#e0f2fe",
                        color: "#075985",
                        fontWeight: 600,
                      }}
                    >
                      {badge.name === "Verified Seller" && (
                        <FaCheckCircle color="#229ED9" />
                      )}
                      {badge.name}
                    </span>
                  ))}
                </div>
              )}

              <p style={{ fontWeight: "bold" }}>{u.field || "N/A"}</p>
              <p style={{ fontSize: 14, color: "#555" }}>
                {u.about || "No bio yet."}
              </p>

              {/* ACTION ICONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  paddingTop: 10,
                  borderTop: "1px solid #eee",
                }}
              >
                <FaThumbsUp size={20} color="#4CAF50" />
                <FaThumbsDown size={20} color="#F44336" />
                <FaEnvelope size={20} color="#2196F3" />
                <FaEye
                  size={20}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/user/${u.userId}`)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CombinedUsers;
