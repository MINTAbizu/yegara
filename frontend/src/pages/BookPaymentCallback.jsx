import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const BookPaymentCallback = () => {
  const location = useLocation();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verify = async () => {
      const txRef = new URLSearchParams(location.search).get("tx_ref");
      const token = localStorage.getItem("token");

      if (!txRef || !token) {
        setStatus("failed");
        return;
      }

      try {
        await axios.post(`${API_URL}/api/books/payment/verify/${encodeURIComponent(txRef)}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        sessionStorage.removeItem(`book_payment_${txRef}`);
        setStatus("success");
        toast.success("Payment verified. Your book is ready.");
      } catch (err) {
        setStatus("failed");
        toast.error(err.response?.data?.message || "Payment verification failed");
      }
    };

    verify();
  }, [location.search]);

  return (
    <div className="container py-5 text-center">
      {status === "verifying" && <><div className="spinner-border text-primary mb-3" /><h2>Verifying payment...</h2></>}
      {status === "success" && <><h2 className="text-success">Book access unlocked</h2><p className="text-muted">You can now download your book from purchases.</p><Link className="btn btn-primary" to="/my-book-purchases">Go to My Books</Link></>}
      {status === "failed" && <><h2 className="text-danger">Payment not confirmed</h2><p className="text-muted">Please try again or contact support if you were charged.</p><Link className="btn btn-outline-primary" to="/books">Back to Books</Link></>}
    </div>
  );
};

export default BookPaymentCallback;
