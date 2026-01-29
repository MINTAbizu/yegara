import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
  FaThumbsUp,
  FaThumbsDown,
  FaEnvelope,
  FaEye,
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");

      const usersRes = await axios.get(
        `${API_URL}/api/users/ouruser?page=1&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const profilesRes = await axios.get(
        `${API_URL}/api/profile/approved?page=1&limit=${limit}`
      );

      setUsers(usersRes.data.users || []);
      setProfiles(profilesRes.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (users.length) {
      const merged = users.map((u) => {
        const profile = profiles.find(
          (p) => p.user?._id === u._id
        );

        return {
          ...u,
          profile,
          unreadMessages: u.unreadMessages || 0, // demo value
        };
      });
      setMergedData(merged);
    }
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
        Our Users
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
              src={
                u.profile?.backgroundImage ||
                "https://via.placeholder.com/400x200"
              }
              alt="background"
              style={{ width: "100%", height: 120, objectFit: "cover" }}
            />

            {/* Avatar + Telegram Badge */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={
                  u.profile?.avatar ||
                  "https://via.placeholder.com/200"
                }
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

              {/* 🔵 Telegram-style badge */}
              {u.badges?.length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    minWidth: 20,
                    height: 20,
                    padding: "0 6px",
                    backgroundColor: "#3390ec",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 600,
                    borderRadius: 999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 0 2px #fff",
                  }}
                >
                  {u.badges.length > 99 ? "99+" : u.badges.length}
                </span>
              )}
            </div>

            <div style={{ padding: 12 }}>
              <h3 style={{ marginBottom: 4 }}>{u.name}</h3>

              <p style={{ fontWeight: "bold", marginBottom: 5 }}>
                {u.profile?.field || "N/A"}
              </p>

              <p style={{ fontSize: 14, color: "#555" }}>
                {u.profile?.about || "No bio yet."}
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
                <FaThumbsUp
                  size={20}
                  color="#4CAF50"
                  style={{ cursor: "pointer" }}
                />

                <FaThumbsDown
                  size={20}
                  color="#F44336"
                  style={{ cursor: "pointer" }}
                />

                {/* Envelope + Telegram Badge */}
                <div style={{ position: "relative" }}>
                  <FaEnvelope
                    size={20}
                    color="#2196F3"
                    style={{ cursor: "pointer" }}
                  />

                  {u.unreadMessages > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -8,
                        minWidth: 16,
                        height: 16,
                        backgroundColor: "#3390ec",
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: 600,
                        borderRadius: 999,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 4px",
                      }}
                    >
                      {u.unreadMessages > 99
                        ? "99+"
                        : u.unreadMessages}
                    </span>
                  )}
                </div>

                <FaEye
                  size={20}
                  color="#555"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/user/${u._id}`)}
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
