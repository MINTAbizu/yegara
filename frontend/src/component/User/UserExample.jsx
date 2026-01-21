import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";
import "./UserCard.css";

const API_URL = import.meta.env.VITE_API_URL;

const UserExample = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_URL}/api/users/ouruser`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch users error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    // 🔥 Auto-refresh every 1 second
    const interval = setInterval(fetchUsers, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading users...</p>;

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
          marginTop: "18px",
        }}
      >
        {users.map((u) => (
          <UserCard
            key={u._id}
            user={{
              name: u.name,
              image: "https://via.placeholder.com/200",
              description: u.email,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default UserExample;
