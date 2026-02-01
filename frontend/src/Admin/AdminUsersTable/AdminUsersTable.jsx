import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const AVAILABLE_BADGES = [
  { name: "Verified Seller", icon: "✔️", color: "bg-blue-100 text-blue-700" },
  { name: "Top Contributor", icon: "⭐", color: "bg-yellow-100 text-yellow-700" },
  { name: "Moderator", icon: "🛠️", color: "bg-red-100 text-red-700" },
];

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // 🔍 Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // ================= FETCH USERS =================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // 🆕 Newest users first
        const sortedUsers = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setUsers(sortedUsers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  // ================= DELETE USER =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= BADGE MODAL =================
  const openBadgeModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

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
          u._id === selectedUser._id ? { ...u, badges: res.data.badges } : u
        )
      );

      alert("Badge assigned!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign badge");
    }
  };

  const removeBadge = async (userId, badgeName) => {
    if (!window.confirm(`Remove badge "${badgeName}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_URL}/api/users/${userId}/badges`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { badgeName },
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, badges: res.data.badges } : u
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to remove badge");
    }
  };

  // ================= SEARCH + PAGINATION =================
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // ================= RENDER =================
  return (
    <>
      {/* 🔍 Search */}
      <div className="mb-2 d-flex justify-content-end">
        <input
          type="text"
          className="form-control form-control-sm"
          style={{ maxWidth: "250px" }}
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 📋 Users Table */}
      <div className="table-responsive">
        <table className="table table-sm table-bordered table-hover text-center align-middle">
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
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="6">No users found</td>
              </tr>
            ) : (
              currentUsers.map((u, i) => (
                <tr key={u._id}>
                  <td>{indexOfFirstUser + i + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>

                  <td>
                    {u.badges?.map((b, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-1 rounded-full text-xs mr-1 ${b.color}`}
                      >
                        {b.icon} {b.name}
                        <FaTimes
                          className="ml-1 text-danger cursor-pointer"
                          size={10}
                          onClick={() => removeBadge(u._id, b.name)}
                        />
                      </span>
                    ))}
                  </td>

                  <td>{u.createdAt?.slice(0, 10)}</td>

                  <td>
                    <button
                      className="btn btn-sm btn-outline-warning mx-1"
                      onClick={() => openBadgeModal(u)}
                    >
                      🏆 Badge
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger mx-1"
                      onClick={() => handleDelete(u._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-sm btn-secondary mx-1"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="mx-2 align-self-center">
          Page {currentPage} of {totalPages}
        </span>

        <button
          className="btn btn-sm btn-secondary mx-1"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* 🏆 Badge Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 d-flex align-items-center justify-content-center">
          <div className="bg-white p-4 rounded shadow" style={{ width: 300 }}>
            <h5 className="mb-3">
              Assign Badge to <b>{selectedUser.name}</b>
            </h5>

            {AVAILABLE_BADGES.map((b) => (
              <button
                key={b.name}
                className="btn btn-outline-primary w-100 mb-2"
                onClick={() => assignBadge(b.name)}
              >
                {b.icon} {b.name}
              </button>
            ))}

            <button
              className="btn btn-outline-secondary w-100 mt-2"
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsersTable;
