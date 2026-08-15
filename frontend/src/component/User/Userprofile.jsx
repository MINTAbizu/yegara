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

const normalizeProfiles = (value) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.profiles)) return value.profiles;
  if (Array.isArray(value?.data)) return value.data;
  return [];
};

const CombinedUsers = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/profile/approved`);
      setProfiles(normalizeProfiles(res.data));
    } catch (err) {
      console.error("Fetch error:", err);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", height: 200 }}>
        <ClipLoader size={60} />
      </div>
    );
  }

  const safeProfiles = normalizeProfiles(profiles);

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
        {safeProfiles.map((p) => (
          <div
            key={p._id}
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
              src={p.backgroundImage || "https://via.placeholder.com/400x200"}
              alt="background"
              style={{ width: "100%", height: 120, objectFit: "cover" }}
            />

            {/* Avatar */}
            <img
              src={p.avatar || "https://via.placeholder.com/200"}
              alt={p.user?.name}
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
              <h3>{p.user?.name}</h3>

              <span style={{ color: "#229ED9", fontSize: 14 }}>
                <FaCheckCircle /> Verified
              </span>

              <p style={{ fontWeight: "bold" }}>{p.field}</p>
              <p style={{ fontSize: 14 }}>{p.about}</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  paddingTop: 10,
                  borderTop: "1px solid #eee",
                }}
              >
                <FaThumbsUp />
                <FaThumbsDown />
                <FaEnvelope />
                <FaEye
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/user/${p.user?._id}`)}
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
