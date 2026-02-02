import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  FaBell,
  FaTimes,
  FaTrash,
  FaUserShield,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API_URL = import.meta.env.VITE_API_URL;

const AVAILABLE_BADGES = [
  { name: "Verified Seller", icon: "✔️" },
  { name: "Top Contributor", icon: "⭐" },
  { name: "Moderator", icon: "🛠️" },
];

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const USERS_PER_PAGE = 10;

  /* ================= FETCH + AUTO REFRESH ================= */
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setUsers(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ================= DATE HELPERS ================= */
  const daysAgo = (n) =>
    new Date(Date.now() - n * 24 * 60 * 60 * 1000);

  /* ================= DASHBOARD METRICS ================= */
  const stats = useMemo(() => {
    return {
      total: users.length,
      last7: users.filter((u) => new Date(u.createdAt) >= daysAgo(7)).length,
      last30: users.filter((u) => new Date(u.createdAt) >= daysAgo(30)).length,
      withBadges: users.filter((u) => u.badges?.length > 0).length,
      verified: users.filter((u) =>
        u.badges?.some((b) => b.name === "Verified Seller")
      ).length,
    };
  }, [users]);

  /* ================= NOTIFICATIONS ================= */
  const notifications = useMemo(() => {
    return {
      newUsers: users.filter((u) => new Date(u.createdAt) >= daysAgo(7)),
      noBadges: users.filter((u) => !u.badges || u.badges.length === 0),
      missingVerified: users.filter(
        (u) =>
          !u.badges?.some((b) => b.name === "Verified Seller")
      ),
    };
  }, [users]);

  /* ================= BADGE ACTIONS ================= */
  const assignBadge = async (badgeName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/users/${selectedUser._id}/badges`,
        { badgeName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id
            ? { ...u, badges: res.data.badges }
            : u
        )
      );

      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const removeBadge = async (userId, badgeName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${API_URL}/api/users/${userId}/badges`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { badgeName },
        }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, badges: res.data.badges } : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SOFT DELETE ================= */
  const softDelete = (id, role) => {
    if (["admin", "moderator"].includes(role)) return;
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  /* ================= FILTER + PAGINATION ================= */
  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const start = (page - 1) * USERS_PER_PAGE;
  const paged = filtered.slice(start, start + USERS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);

  /* ================= RENDER ================= */
  return (
    <div className="container mt-4">

      {/* 🔔 NOTIFICATION BELL */}
      <div className="d-flex justify-content-end mb-3">
        <div className="dropdown">
          <button className="btn btn-light" data-bs-toggle="dropdown">
            <FaBell />
            <span className="badge bg-danger ms-1">
              {notifications.newUsers.length +
                notifications.noBadges.length}
            </span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end p-2" style={{ width: 300 }}>
            <h6 className="dropdown-header">Admin Alerts</h6>

            <li className="dropdown-item">
              🆕 New users (7d): {notifications.newUsers.length}
            </li>
            <li className="dropdown-item">
              ⚠️ No badge: {notifications.noBadges.length}
            </li>
            <li className="dropdown-item">
              ✔️ Missing verified: {notifications.missingVerified.length}
            </li>
          </ul>
        </div>
      </div>

      {/* 📊 DASHBOARD CARDS */}
      <div className="row g-3 mb-4">
        {[
          ["Total Users", stats.total],
          ["New (7d)", stats.last7],
          ["New (30d)", stats.last30],
          ["With Badges", stats.withBadges],
          ["Verified Sellers", stats.verified],
        ].map(([label, value]) => (
          <div className="col-md-2" key={label}>
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <small>{label}</small>
                <h4>{value}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔍 SEARCH */}
      <input
        className="form-control form-control-sm mb-2"
        placeholder="Search user..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* 📋 TABLE */}
      <table className="table table-sm table-hover text-center align-middle">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Badges</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paged.map((u, i) => (
            <tr key={u._id}>
              <td>{start + i + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>

              <td>
                {u.badges?.map((b, idx) => (
                  <span key={idx} className="badge bg-secondary me-1">
                    {b.icon} {b.name}
                    <FaTimes
                      className="ms-1 text-danger"
                      style={{ cursor: "pointer" }}
                      onClick={() => removeBadge(u._id, b.name)}
                    />
                  </span>
                ))}
              </td>

              <td>{u.createdAt.slice(0, 10)}</td>

              <td>
                <button
                  className="btn btn-sm btn-outline-warning me-1"
                  data-bs-toggle="modal"
                  data-bs-target="#badgeModal"
                  onClick={() => setSelectedUser(u)}
                >
                  🏆
                </button>

                <button
                  className="btn btn-sm btn-outline-danger"
                  disabled={["admin", "moderator"].includes(u.role)}
                  onClick={() => softDelete(u._id, u.role)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🏆 MODAL */}
      <div className="modal fade" id="badgeModal">
        <div className="modal-dialog modal-sm modal-dialog-centered">
          <div className="modal-content p-3">
            <h6>Assign Badge</h6>

            {AVAILABLE_BADGES.map((b) => (
              <button
                key={b.name}
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => assignBadge(b.name)}
                data-bs-dismiss="modal"
              >
                {b.icon} {b.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersTable;
