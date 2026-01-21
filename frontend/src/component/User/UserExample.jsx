import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "./UserCard";

const API_URL = import.meta.env.VITE_API_URL;

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

      // ✅ REPLACE users (not append)
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch users error:", err);
    }
  };

  // Fetch users whenever page changes
  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // ⏱️ Auto change page every 1 second
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
          <UserCard
            key={u._id}
            user={{
              name: u.name,
              image: "https://via.placeholder.com/200",
              // description: u.email,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default UserExample;
