import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const API_URL = import.meta.env.VITE_API_URL;

const UserExample = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchUsers = async (pageNum) => {
    setLoading(true); // ✅ Start loading

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
    } finally {
      setLoading(false); // ✅ Stop loading
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

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <ClipLoader loading={loading} size={60} />
        </div>
      ) : (
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
              <div style={{ height: "120px", width: "100%" }}>
                <img
                  src={u.backgroundImage || "https://via.placeholder.com/400x200"}
                  alt="background"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div style={{ marginTop: "-50px" }}>
                <img
                  src={u.avatar || "https://via.placeholder.com/200"}
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
                <p>
                  {/* <strong>Region:</strong> {u.region || "N/A"} */}
                </p>
                <p>
                  <strong>Field:</strong> {u.field || "N/A"}
                </p>
                <p>
                  {/* <strong>Telegram:</strong> {u.telegram || "N/A"} */}
                </p>
                <p style={{ fontSize: "14px", color: "#555" }}>
                  {u.about ? u.about.slice(0, 120) + "..." : "No bio yet."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default UserExample;
