import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = import.meta.env.VITE_API_URL;

const AdminProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 10;

  // ================= FETCH PROFILES =================
  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // newest first
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProfiles(sorted);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();

    // 🔁 auto refresh every 30 sec
    const interval = setInterval(fetchProfiles, 30000);
    return () => clearInterval(interval);
  }, []);

  // ================= UPDATE STATUS =================
  const handleStatusChange = async (id, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this profile?`))
      return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/profile/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setProfiles((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status } : p))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  // ================= NOTIFICATION COUNT =================
  const pendingCount = profiles.filter(
    (p) => p.status === "pending"
  ).length;

  // ================= SEARCH + PAGINATION =================
  const filteredProfiles = profiles.filter((p) =>
    p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * profilesPerPage;
  const indexOfFirst = indexOfLast - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredProfiles.length / profilesPerPage
  );

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container-fluid mt-4">
      {/* 🔔 HEADER + NOTIFICATION */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>User Profiles</h3>

        <div style={{ position: "relative" }}>
          <i className="bi bi-bell fs-4"></i>

          {pendingCount > 0 && (
            <span
              className="badge bg-danger"
              style={{
                position: "absolute",
                top: "-6px",
                right: "-10px",
                fontSize: "0.7rem",
                // color:'red'
              }}
            >
              {pendingCount}
            </span>
          )}
        </div>
      </div>

      {/* 🔍 Search */}
      <div className="mb-2 d-flex justify-content-end">
        <input
          type="text"
          className="form-control form-control-sm"
          style={{ maxWidth: "250px" }}
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* 📋 Table */}
      <div className="table-responsive">
        <table className="table table-sm table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Avatar</th>
              <th>User</th>
              <th>About</th>
              <th>Region</th>
              <th>Field</th>
              <th>Shop/Home</th>
              <th>Telegram</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentProfiles.length > 0 ? (
              currentProfiles.map((profile, i) => (
                <tr key={profile._id}>
                  <td>{indexOfFirst + i + 1}</td>

                  <td>
                    <img
                      src={`${API_URL}/${profile.avatar}`}
                      alt="avatar"
                      className="rounded-circle"
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "cover",
                      }}
                    />
                  </td>

                  <td>{profile.user?.name || "N/A"}</td>
                  <td>{profile.about || "-"}</td>
                  <td>{profile.region || "-"}</td>
                  <td>{profile.field || "-"}</td>
                  <td>{profile.shopLocation || "-"}</td>
                  <td>{profile.telegram || "-"}</td>

                  <td>
                    <span
                      className={
                        profile.status === "approved"
                          ? "badge bg-success"
                          : profile.status === "rejected"
                          ? "badge bg-danger"
                          : "badge bg-secondary"
                      }
                    >
                      {profile.status || "pending"}
                    </span>
                  </td>

                  <td>
                    {profile.status !== "approved" && (
                      <button
                        className="btn btn-success btn-sm me-1"
                        onClick={() =>
                          handleStatusChange(profile._id, "approved")
                        }
                      >
                        Approve
                      </button>
                    )}

                    {profile.status !== "rejected" && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleStatusChange(profile._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  No profiles found.
                </td>
              </tr>
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
    </div>
  );
};

export default AdminProfileList;
