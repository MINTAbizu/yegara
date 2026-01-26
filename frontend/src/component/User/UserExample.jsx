import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const avatarPlaceholder =
  "https://via.placeholder.com/100";
const bgPlaceholder =
  "https://via.placeholder.com/400x120";

const UserExample = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const usersRes = await axios.get(
        `${API_URL}/api/users/ouruser`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const profileRes = await axios.get(
        `${API_URL}/api/profile/ourusers`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const users = usersRes.data.users;
      const profiles = profileRes.data.profiles;
     console.log("Fetched users:", users);
      console.log("Fetched profiles:", profiles);
      const merged = users.map((u) => {
        const profile = profiles.find((p) => String(p.user._id) === String(u._id));
        return {
          ...u,
          avatar: profile?.avatar,
          backgroundImage: profile?.backgroundImage,
          field: profile?.field,
          about: profile?.about,
        };
      });

      setData(merged);
    } catch (err) {
      console.error("Fetch data error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Our Users</h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        {data.map((u) => (
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
            {/* Background */}
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

            <div style={{ padding: "10px" }}>
              <h3>{u.name}</h3>
              <p><strong>Field:</strong> {u.field || "N/A"}</p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {u.about ? u.about.slice(0, 120) + "..." : "No bio yet."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserExample;
