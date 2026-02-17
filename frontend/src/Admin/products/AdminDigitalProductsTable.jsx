import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDigitalProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // 🔍 Search & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `${API_URL}/api/digital-products/admin/all`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      const data = Array.isArray(res.data) ? res.data : [];
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setProducts(data);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  // ================= STATUS =================
  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `${API_URL}/api/digital-products/admin/toggle/${id}`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );
      fetchProducts();
    } catch (err) {
      console.error("Toggle Status Error:", err);
    }
  };

  // ================= DERIVED DATA =================
  const pendingProducts = products.filter(
    (p) => p.status?.toLowerCase() === "pending"
  );

  const approvedCount = products.filter(
    (p) => p.status === "approved"
  ).length;

  const rejectedCount = products.filter(
    (p) => p.status === "rejected"
  ).length;

  // ================= SEARCH + PAGINATION =================
  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container py-4">
      {/* ================= HEADER + NOTIFICATION ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Digital Products (Admin)</h3>

        <div style={{ position: "relative" }}>
          <span
            style={{ fontSize: "22px", cursor: "pointer" }}
            onClick={() => setShowDropdown((p) => !p)}
          >
            🔔
          </span>

          {pendingProducts.length > 0 && (
            <span
              className="badge bg-danger"
              style={{
                position: "absolute",
                top: "-6px",
                right: "-10px",
                fontSize: "0.7rem",
              }}
            >
              {pendingProducts.length}
            </span>
          )}

          {showDropdown && (
            <div
              className="card shadow"
              style={{
                position: "absolute",
                right: 0,
                top: "30px",
                width: "300px",
                zIndex: 1000,
              }}
            >
              <div className="card-header fw-bold">
                Pending Products
              </div>

              <div className="card-body p-2">
                {pendingProducts.length === 0 ? (
                  <p className="text-muted mb-0">No pending products</p>
                ) : (
                  pendingProducts.slice(0, 5).map((p) => (
                    <div
                      key={p._id}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <span style={{ fontSize: "13px" }}>
                        {p.productName}
                      </span>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleToggleStatus(p._id)}
                      >
                        Approve
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= DASHBOARD SUMMARY ================= */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Total Products</h6>
              <h4>{products.length}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body text-warning">
              <h6>Pending</h6>
              <h4>{pendingProducts.length}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body text-success">
              <h6>Approved</h6>
              <h4>{approvedCount}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center shadow-sm">
            <div className="card-body text-danger">
              <h6>Rejected</h6>
              <h4>{rejectedCount}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-2 d-flex justify-content-end">
        <input
          type="text"
          className="form-control form-control-sm"
          style={{ maxWidth: "250px" }}
          placeholder="Search product name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Location</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentProducts.map((p, i) => (
              <tr key={p._id}>
                <td>{indexOfFirst + i + 1}</td>

                <td>
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.productName}
                      style={{
                        width: "45px",
                        height: "45px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  )}
                </td>

                <td>{p.productName}</td>

                <td>{p.price} ETB</td>

                {/* ✅ LOCATION COLUMN */}
               <td>
  {p.location?.coordinates ? (
    <span className="badge bg-info text-dark">
      {p.location.coordinates[1].toFixed(4)},{" "}
      {p.location.coordinates[0].toFixed(4)}
    </span>
  ) : (
    <span className="text-muted">—</span>
  )}
</td>


                <td>
                  <span
                    className={`badge ${
                      p.status === "approved"
                        ? "bg-success"
                        : p.status === "rejected"
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleToggleStatus(p._id)}
                  >
                    Toggle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
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

export default AdminDigitalProductsTable;
