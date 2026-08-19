import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBookOpen, FaCheckCircle, FaDownload, FaLock } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;
const assetUrl = (path) => path?.startsWith("http") ? path : `${API_URL}${path}`;

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Book not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const buyBook = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(`/login?redirect=/books/${id}`);
      return;
    }

    setPaying(true);
    try {
      const res = await axios.post(`${API_URL}/api/books/${id}/checkout`, {}, { headers: { Authorization: `Bearer ${token}` } });
      sessionStorage.setItem(`book_payment_${res.data.tx_ref}`, JSON.stringify({ orderId: res.data.orderId, bookId: id }));
      window.location.href = res.data.checkout_url;
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to start payment");
      setPaying(false);
    }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary" /></div>;
  if (!book) return <div className="container py-5"><p className="text-muted">Book not available.</p></div>;

  return (
    <main className="container py-5">
      <div className="row g-4 align-items-start">
        <div className="col-lg-5">
          <div className="bg-light rounded overflow-hidden shadow-sm" style={{ aspectRatio: "4 / 4" }}>
            {book.image ? <img src={assetUrl(book.image)} alt={book.bookName} className="w-100 h-100" style={{ objectFit: "cover" }} /> : <div className="h-100 d-flex align-items-center justify-content-center"><FaBookOpen size={60} /></div>}
          </div>
        </div>
        <div className="col-lg-7">
          <span className="badge bg-primary mb-3">Digital Book</span>
          <h1 className="h2 fw-bold">{book.bookName}</h1>
          <p className="text-muted">By {book.seller?.name || "Yegara seller"}</p>
          <h3 className="text-success mb-3">{Number(book.price || 0).toLocaleString()} ETB</h3>
          <p className="lead" style={{ lineHeight: 1.7 }}>{book.description}</p>

          <div className="row g-3 my-4">
            <div className="col-sm-4"><div className="border rounded p-3 h-100"><FaDownload className="text-primary mb-2" /><strong className="d-block">Instant access</strong><small className="text-muted">Download after payment</small></div></div>
            <div className="col-sm-4"><div className="border rounded p-3 h-100"><FaLock className="text-primary mb-2" /><strong className="d-block">Protected file</strong><small className="text-muted">Only paid buyers can access</small></div></div>
            <div className="col-sm-4"><div className="border rounded p-3 h-100"><FaCheckCircle className="text-primary mb-2" /><strong className="d-block">Approved listing</strong><small className="text-muted">Reviewed by admin</small></div></div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-primary btn-lg" onClick={buyBook} disabled={paying}>{paying ? "Redirecting..." : "Buy Book"}</button>
            <Link className="btn btn-outline-secondary btn-lg" to="/books">Back to Books</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookDetails;
