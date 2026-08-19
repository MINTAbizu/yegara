import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBookOpen, FaDownload, FaSearch, FaShieldAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const assetUrl = (path) => path?.startsWith("http") ? path : `${API_URL}${path}`;

const BookMarketplace = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/books`);
        setBooks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch books error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return books.filter((book) => `${book.bookName || ""} ${book.description || ""}`.toLowerCase().includes(term));
  }, [books, searchTerm]);

  return (
    <section className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <p className="text-primary fw-bold mb-1">Digital books</p>
          <h2 className="mb-1">Book Marketplace</h2>
          <p className="text-muted mb-0">Buy approved books and access downloads after successful payment.</p>
        </div>
        <div className="input-group" style={{ maxWidth: 320 }}>
          <span className="input-group-text"><FaSearch /></span>
          <input className="form-control" placeholder="Search books..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="row g-4">
          {filteredBooks.map((book) => (
            <div className="col-12 col-sm-6 col-lg-4" key={book._id}>
              <article className="card h-100 border-0 shadow-sm">
                <div style={{ aspectRatio: "4 / 3", overflow: "hidden", background: "#eef2f7" }}>
                  {book.image ? <img src={assetUrl(book.image)} alt={book.bookName} className="w-100 h-100" style={{ objectFit: "cover" }} /> : <div className="h-100 d-flex align-items-center justify-content-center"><FaBookOpen size={42} /></div>}
                </div>
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                    <h5 className="card-title mb-0">{book.bookName}</h5>
                    <span className="badge bg-light text-dark border">{(book.fileType || "ebook").toUpperCase()}</span>
                  </div>
                  <p className="card-text text-muted small flex-grow-1">{book.description?.slice(0, 130)}{book.description?.length > 130 ? "..." : ""}</p>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <strong className="text-success">{Number(book.price || 0).toLocaleString()} ETB</strong>
                    <small className="text-muted">By {book.seller?.name || "Seller"}</small>
                  </div>
                  <div className="d-grid gap-2">
                    <Link className="btn btn-primary" to={`/books/${book._id}`}>View and Buy</Link>
                    <small className="text-muted d-flex align-items-center gap-2"><FaShieldAlt /> Download unlocks after payment</small>
                  </div>
                </div>
              </article>
            </div>
          ))}
          {filteredBooks.length === 0 && <p className="text-center text-muted py-5">No approved books found.</p>}
        </div>
      )}
    </section>
  );
};

export default BookMarketplace;
