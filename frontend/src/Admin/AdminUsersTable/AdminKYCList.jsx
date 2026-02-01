import React, { useEffect, useState } from "react";
import "../Admin.css";
const API_URL = import.meta.env.VITE_API_URL;

const AdminKYCList = () => {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ================= FETCH KYC =================
  const fetchKYC = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/kyc`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      // 🆕 newest first
      const sorted = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setKycList(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYC();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this KYC?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/kyc/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setKycList((prev) => prev.filter((k) => k._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SEARCH + PAGINATION =================
  const filtered = kycList.filter((k) =>
    k.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container-fluid mt-4">
      <h3>KYC Submissions</h3>

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
              <th>User</th>
              <th>Full Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Nationality</th>
              <th>Marital Status</th>
              <th>ID Type</th>
              <th>ID Number</th>
              <th>Residential Address</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((kyc, i) => (
                <tr key={kyc._id}>
                  <td>{indexOfFirst + i + 1}</td>
                  <td>{kyc.user?.name || "N/A"}</td>
                  <td>{kyc.fullName}</td>
                  <td>{kyc.dob}</td>
                  <td>{kyc.gender}</td>
                  <td>{kyc.nationality}</td>
                  <td>{kyc.maritalStatus}</td>
                  <td>{kyc.idType}</td>
                  <td>{kyc.idNumber}</td>
                  <td>{kyc.residentialAddress}</td>
                  <td>
                    {kyc.faceId && (
                      <a
                        href={`http://localhost:5000/uploads/${kyc.faceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`http://localhost:5000/uploads/${kyc.faceId}`}
                          alt="Face ID"
                          width="50"
                          className="img-thumbnail me-1"
                        />
                      </a>
                    )}
                    {kyc.idFront && (
                      <a
                        href={`http://localhost:5000/uploads/${kyc.idFront}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`http://localhost:5000/uploads/${kyc.idFront}`}
                          alt="ID Front"
                          width="50"
                          className="img-thumbnail me-1"
                        />
                      </a>
                    )}
                    {kyc.idBack && (
                      <a
                        href={`http://localhost:5000/uploads/${kyc.idBack}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={`http://localhost:5000/uploads/${kyc.idBack}`}
                          alt="ID Back"
                          width="50"
                          className="img-thumbnail"
                        />
                      </a>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(kyc._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">
                  No KYC submissions found.
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

export default AdminKYCList;
