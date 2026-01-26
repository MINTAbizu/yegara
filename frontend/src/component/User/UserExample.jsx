import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const avatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23ddd'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='%23777'%3EAvatar%3C/text%3E%3C/svg%3E";

const bgPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect width='400' height='200' fill='%23ddd'/%3E%3Ctext x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='20' fill='%23777'%3EBackground%3C/text%3E%3C/svg%3E";

const UserExample = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchUsers = async (pageNum) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        `${API_URL}/api/users/ouruser?page=${pageNum}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev >= totalPages ? 1 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [totalPages]);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>Our Users</h1>

      <div
        style={{
          padding: "20px",
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {users.map((u) => (
          <div
            key={u._id}
            style={{
              width: "280px",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            {/* Background Image */}
            <div style={{ height: "120px", width: "100%" }}>
              <img
                src={u.backgroundImage || bgPlaceholder}
                alt="background"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Avatar */}
            <div style={{ marginTop: "-50px" }}>
              <img
                src={u.avatar || avatarPlaceholder}
                alt={u.name}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "5px solid white",
                }}
              />
            </div>

            {/* User Info */}
            <div style={{ padding: "10px" }}>
              <h3>{u.name}</h3>
              {/* <p><strong>Region:</strong> {u.region || "N/A"}</p> */}
              <p><strong>Field:</strong> {u.field || "N/A"}</p>
              <p><strong>Telegram:</strong> {u.telegram || "N/A"}</p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {u.about ? u.about.slice(0, 120) + "..." : "No bio yet."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserExample;
