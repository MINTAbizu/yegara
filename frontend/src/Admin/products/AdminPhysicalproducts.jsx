import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBell,
  FaBox,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API_URL = import.meta.env.VITE_API_URL;

const AdminPhysicalproducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/physical-products/Admin`
      );
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.products || [];
      setProducts(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // 🔄 auto refresh every 30 seconds
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  /* ================= STATUS ================= */
  const handleToggleStatus = async (id, status = "approved") => {
    try {
      await axios.patch(
        `${API_URL}/api/physical-products/toggle-status/${id}`,
        { status }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status } : p
        )
      );
    } catch (err) {
      console.error("Toggle Status Error:", err);
    }
  };

  /* ================= FILTERS ================= */
  const pendingProducts = products.filter(
    (p) => p.status === "pending"
  );

  const approvedCount = products.filter(
    (p) => p.status === "approved"
  ).length;

  const rejectedCount = products.filter(
    (p) => p.status === "rejected"
  ).length;

  if (loading) return <p className="p-3">Loading...</p>;

  return (
    <div className="container py-4">

      {/* ================= HEADER ================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Physical Products</h3>

        {/* 🔔 Notification Dropdown */}
        <div className="dropdown">
          <button
            className="btn btn-light position-relative"
            data-bs-toggle="dropdown"
          >
            <FaBell size={20} />
            {pendingProducts.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {pendingProducts.length}
              </span>
            )}
          </button>

          <ul
            className="dropdown-menu dropdown-menu-end p-2"
            style={{ width: "320px" }}
          >
            <h6 className="dropdown-header">
              Pending Products
            </h6>

            {pendingProducts.length === 0 && (
              <li className="dropdown-item text-muted">
                No pending products
              </li>
            )}

            {pendingProducts.map((p) => (
              <li key={p._id} className="dropdown-item">
                <div className="d-flex justify-content-between align-items-center">
                  <span>{p.productName}</span>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() =>
                      handleToggleStatus(p._id, "approved")
                    }
                  >
                    Approve
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= DASHBOARD CARDS ================= */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FaBox size={28} className="text-primary mb-2" />
              <h6>Total Products</h6>
              <h4>{products.length}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FaClock size={28} className="text-warning mb-2" />
              <h6>Pending</h6>
              <h4>{pendingProducts.length}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FaCheckCircle size={28} className="text-success mb-2" />
              <h6>Approved</h6>
              <h4>{approvedCount}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center">
            <div className="card-body">
              <FaTimesCircle size={28} className="text-danger mb-2" />
              <h6>Rejected</h6>
              <h4>{rejectedCount}</h4>
            </div>
          </div>
        </div>

      </div>

      {/* ================= TABLE ================= */}
      {!products.length ? (
        <p>No physical products found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm table-striped table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Links</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, i) => (
                <tr key={p._id}>
                  <td>{i + 1}</td>

                  <td>
                    {p.image && (
                      <img
                        src={`http://localhost:5000${p.image}`}
                        alt={p.productName}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    )}
                  </td>

                  <td>{p.productName}</td>
                  <td>{p.price} ETB</td>

                  <td style={{ fontSize: 12 }}>
                    {p.telegram && (
                      <div>
                        <a
                          href={
                            p.telegram.startsWith("http")
                              ? p.telegram
                              : `https://t.me/${p.telegram}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          Telegram
                        </a>
                      </div>
                    )}
                    {p.drive && (
                      <div>
                        <a href={p.drive} target="_blank" rel="noreferrer">
                          Drive
                        </a>
                      </div>
                    )}
                    {p.dropbox && (
                      <div>
                        <a href={p.dropbox} target="_blank" rel="noreferrer">
                          Dropbox
                        </a>
                      </div>
                    )}
                  </td>

                  <td>
                    <span
                      className={`badge ${
                        p.status === "approved"
                          ? "bg-success"
                          : p.status === "rejected"
                          ? "bg-danger"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td>
                    {p.status !== "approved" && (
                      <button
                        className="btn btn-sm btn-success me-1"
                        onClick={() =>
                          handleToggleStatus(p._id, "approved")
                        }
                      >
                        Approve
                      </button>
                    )}
                    {p.status !== "rejected" && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleToggleStatus(p._id, "rejected")
                        }
                      >
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPhysicalproducts;
