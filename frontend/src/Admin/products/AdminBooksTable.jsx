import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const tokenHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

const AdminBooksTable = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/books/admin/all`, { headers: tokenHeaders() });
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch books error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const toggleStatus = async (id) => {
    await axios.patch(`${API_URL}/api/books/admin/toggle/${id}`, {}, { headers: tokenHeaders() });
    fetchBooks();
  };

  const filteredBooks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return books.filter((book) => (book.bookName || "").toLowerCase().includes(term));
  }, [books, searchTerm]);

  const counts = {
    total: books.length,
    pending: books.filter((book) => book.status === "pending").length,
    approved: books.filter((book) => book.status === "approved").length,
    rejected: books.filter((book) => book.status === "rejected").length,
  };

  if (loading) return <p className="text-center py-4">Loading books...</p>;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="mb-1">Books</h3>
          <p className="text-muted mb-0">Review book listings separately from digital products.</p>
        </div>
        <input className="form-control form-control-sm" style={{ maxWidth: 260 }} placeholder="Search books..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="row g-3 mb-4">
        {Object.entries(counts).map(([label, value]) => (
          <div className="col-6 col-lg-3" key={label}>
            <div className="card border-0 shadow-sm"><div className="card-body"><small className="text-muted text-capitalize">{label}</small><h4 className="mb-0">{value}</h4></div></div>
          </div>
        ))}
      </div>

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark"><tr><th>#</th><th>Image</th><th>Book</th><th>Seller</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filteredBooks.map((book, index) => (
              <tr key={book._id}>
                <td>{index + 1}</td>
                <td>{book.image && <img src={book.image} alt={book.bookName} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6 }} />}</td>
                <td>{book.bookName || "Untitled book"}</td>
                <td>{book.seller?.name || "Seller"}</td>
                <td>{Number(book.price || 0).toLocaleString()} ETB</td>
                <td><span className={`badge ${book.status === "approved" ? "bg-success" : book.status === "rejected" ? "bg-danger" : "bg-secondary"}`}>{book.status}</span></td>
                <td><button className="btn btn-sm btn-primary" onClick={() => toggleStatus(book._id)}>Toggle</button></td>
              </tr>
            ))}
            {filteredBooks.length === 0 && <tr><td colSpan="7" className="text-center text-muted py-4">No books found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooksTable;
