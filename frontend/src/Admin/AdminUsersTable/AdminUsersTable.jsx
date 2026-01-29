import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (error) {
        console.error("Failed to load users", error);
        alert(error.response?.data?.message || "Failed to fetch users");
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  // Assign badge
  const handleAssignBadge = async (userId) => {
    const name = prompt("Enter badge name (e.g., Verified Seller):");
    if (!name) return;

    const icon = prompt("Enter badge icon (emoji, e.g., ✔️ or ⭐):") || "⭐";
    const color = prompt(
      "Enter badge color classes (optional, Tailwind, e.g., bg-blue-100 text-blue-700):"
    ) || "bg-green-100 text-green-700";

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_URL}/api/users/${userId}/badges`,
        { name, icon, color },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Badge assigned successfully!");
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, badges: res.data.badges } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to assign badge");
    }
  };

  // Remove badge
  const handleRemoveBadge = async (userId, badgeName) => {
    if (!window.confirm(`Remove badge "${badgeName}" from this user?`)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${API_URL}/api/users/${userId}/badges`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { badgeName }, // send badge name in body
        }
      );

      alert("Badge removed successfully!");
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, badges: res.data.badges } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove badge");
    }
  };

  return (
    <div className="table-responsive" style={{ width: "100%" }}>
      <table
        className="table table-sm table-bordered table-hover text-center align-middle mb-0"
        style={{ fontSize: "0.75rem" }}
      >
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
            <tr key={u._id} style={{ height: "30px" }}>
              <td>{i + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              {/* Display badges with remove button */}
              <td>
                {u.badges?.map((b, idx) => (
                  <span
                    key={idx}
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs mr-1 ${b.color}`}
                    title={b.name}
                  >
                    {b.icon} {b.name}{" "}
                    <FaTimes
                      className="ml-1 cursor-pointer text-red-600"
                      size={10}
                      onClick={() => handleRemoveBadge(u._id, b.name)}
                    />
                  </span>
                ))}
              </td>
              <td>{u.createdAt?.slice(0, 10)}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary mx-1 p-1"
                  title="View"
                >
                  <FaEye size={12} />
                </button>
                <button
                  className="btn btn-sm btn-outline-success mx-1 p-1"
                  title="Edit"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="btn btn-sm btn-outline-danger mx-1 p-1"
                  title="Delete"
                >
                  <FaTrash size={12} />
                </button>
                <button
                  className="btn btn-sm btn-outline-warning mx-1 p-1"
                  title="Assign Badge"
                  onClick={() => handleAssignBadge(u._id)}
                >
                  🏆
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTable;
