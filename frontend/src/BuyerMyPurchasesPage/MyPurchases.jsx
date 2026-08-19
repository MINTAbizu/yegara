import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const MyPurchases = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/api/books/purchases/me`, { headers: { Authorization: `Bearer ${token}` } });
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch purchases error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const downloadUrl = (orderId) => `${API_URL}/api/books/download/${orderId}`;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 className="mb-1">My Books</h2>
          <p className="text-muted mb-0">Paid book purchases and secure downloads.</p>
        </div>
        <Link className="btn btn-outline-primary" to="/books">Browse Books</Link>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="table-responsive bg-white rounded shadow-sm">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark"><tr><th>Book</th><th>Price</th><th>Status</th><th>Access</th><th>Date</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.product?.bookName || "Book"}</td>
                  <td>{Number(order.amount || 0).toLocaleString()} ETB</td>
                  <td><span className={`badge ${order.status === "paid" ? "bg-success" : "bg-secondary"}`}>{order.status}</span></td>
                  <td>{order.status === "paid" ? <a href={downloadUrl(order._id)} className="btn btn-sm btn-success" target="_blank" rel="noreferrer">Download</a> : "Pending payment"}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">No book purchases yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyPurchases;
