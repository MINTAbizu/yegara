import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <>
      {/* Users Table */}
      <div className="table-responsive" style={{ width: "100%" }}>
        <table className="table table-sm table-bordered table-hover text-center align-middle mb-0" style={{ fontSize: "0.75rem" }}>
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
            {users.map((u, i) => (
              <tr key={u._id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {u.badges?.map((b, idx) => (
                    <span key={idx} className={`inline-flex items-center px-2 py-1 rounded-full text-xs mr-1 ${b.color}`} title={`Assigned by ${b.assignedBy}`}>
                      {b.icon} {b.name}{" "}
                      <FaTimes className="ml-1 cursor-pointer text-red-600" size={10} onClick={() => removeBadge(u._id, b.name)} />
                    </span>
                  ))}
                </td>
                <td>{u.createdAt?.slice(0, 10)}</td>
                <td>
                  <button className="btn btn-sm btn-outline-warning mx-1 p-1" onClick={() => openBadgeModal(u)}>🏆 Assign Badge</button>
                  <button className="btn btn-sm btn-outline-danger mx-1 p-1" onClick={() => handleDelete(u._id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Badge Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Assign Badge to {selectedUser.name}</h3>
            <div className="flex flex-col space-y-2">
              {AVAILABLE_BADGES.map((b) => (
                <button
                  key={b.name}
                  className={`px-4 py-2 rounded text-white ${b.color} font-medium`}
                  onClick={() => assignBadge(b.name)}
                >
                  {b.icon} {b.name}
                </button>
              ))}
            </div>
            <button className="mt-4 px-4 py-2 border rounded" onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminUsersTable;
