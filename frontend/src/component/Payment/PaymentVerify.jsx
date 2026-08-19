import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const successCopy = {
  DIRECT_PURCHASE: {
    title: "Purchase confirmed",
    body: "Your order has been paid and fulfillment is ready.",
    link: "/my-book-purchases",
    linkText: "View purchases",
  },
  CROWDFUND_JOIN: {
    title: "Challenge joined",
    body: "Your payment is confirmed and your Equb slot has been reserved.",
    link: "/crowdfunding",
    linkText: "View challenges",
  },
};

const PaymentVerify = () => {
  const location = useLocation();
  const [state, setState] = useState({ status: "verifying", purpose: null, message: "" });

  useEffect(() => {
    const verify = async () => {
      const txRef = new URLSearchParams(location.search).get("tx_ref");

      if (!txRef) {
        setState({ status: "failed", purpose: null, message: "Payment reference is missing." });
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/payments/verify/${encodeURIComponent(txRef)}`);
        const payment = response.data;

        if (payment.status !== "SUCCESS") {
          setState({ status: "pending", purpose: payment.purpose, message: "Payment is not confirmed yet." });
          return;
        }

        sessionStorage.removeItem(`payment_${txRef}`);
        setState({ status: "success", purpose: payment.purpose, message: "" });
      } catch (error) {
        setState({
          status: "failed",
          purpose: null,
          message: error.response?.data?.message || "Payment verification failed.",
        });
      }
    };

    verify();
  }, [location.search]);

  const copy = successCopy[state.purpose] || successCopy.DIRECT_PURCHASE;

  return (
    <main className="container py-5 text-center" style={{ minHeight: "70vh" }}>
      {state.status === "verifying" && (
        <>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h2>Verifying payment...</h2>
          <p className="text-muted">Please wait while we confirm your Chapa payment.</p>
        </>
      )}

      {state.status === "success" && (
        <>
          <h2 className="text-success">{copy.title}</h2>
          <p className="text-muted">{copy.body}</p>
          <Link className="btn btn-primary" to={copy.link}>
            {copy.linkText}
          </Link>
        </>
      )}

      {state.status === "pending" && (
        <>
          <h2 className="text-warning">Payment pending</h2>
          <p className="text-muted">{state.message}</p>
          <Link className="btn btn-outline-primary" to="/">
            Back home
          </Link>
        </>
      )}

      {state.status === "failed" && (
        <>
          <h2 className="text-danger">Payment not confirmed</h2>
          <p className="text-muted">{state.message}</p>
          <Link className="btn btn-outline-primary" to="/">
            Back home
          </Link>
        </>
      )}
    </main>
  );
};

export default PaymentVerify;
