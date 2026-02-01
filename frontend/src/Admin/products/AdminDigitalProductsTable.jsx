import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const API_URL = import.meta.env.VITE_API_URL;

const AdminDigitalProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

      const productsArray = Array.isArray(res.data) ? res.data : [];

      // 🆕 newest first
      productsArray.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProducts(productsArray);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= TOGGLE STATUS =================
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

  // ================= SEARCH + PAGINATION =================
  const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) return <p>Loading...</p>;
  if (!products.length) return <p>No digital products found.</p>;

  return (
    <div className="container py-4">
      <h3 className="mb-3">Digital Products</h3>

      {/* 🔍 Search */}
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

      {/* 📋 Table */}
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
            {currentProducts.length > 0 ? (
              currentProducts.map((p, i) => (
                <tr key={p._id}>
                  <td>{indexOfFirst + i + 1}</td>

                  <td>
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.productName}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    )}
                  </td>

                  <td>{p.productName}</td>
                  <td>{p.price} ETB</td>

                  <td style={{ fontSize: "12px" }}>
                    {p.telegram && (
                      <div>
                        <a href={p.telegram} target="_blank" rel="noreferrer">
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
                    {p.productLink && (
                      <div>
                        <a href={p.productLink} target="_blank" rel="noreferrer">
                          Other
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
                          : "bg-secondary"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td>
                    {p.status === "pending" ? (
                      <>
                        <button
                          className="btn btn-sm btn-success me-1"
                          onClick={() => handleToggleStatus(p._id)}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleToggleStatus(p._id)}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        className={`btn btn-sm ${
                          p.status === "approved"
                            ? "btn-danger"
                            : "btn-success"
                        }`}
                        onClick={() => handleToggleStatus(p._id)}
                      >
                        {p.status === "approved" ? "Reject" : "Approve"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No products found.
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

export default AdminDigitalProductsTable;
