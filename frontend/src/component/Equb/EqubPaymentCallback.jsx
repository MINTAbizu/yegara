import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const EqubPaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying"); // verifying, success, failed

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const tx_ref = searchParams.get("tx_ref");
        const challengeId = searchParams.get("challengeId");

        if (!tx_ref || !challengeId) {
          setStatus("failed");
          toast.error("Invalid payment reference");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        // Get stored payment data
        const paymentData = sessionStorage.getItem(`equb_payment_${tx_ref}`);
        if (!paymentData) {
          setStatus("failed");
          toast.error("Payment session expired");
          setTimeout(() => navigate("/"), 3000);
          return;
        }

        const { userId } = JSON.parse(paymentData);
        const token = localStorage.getItem("token");

        // Verify payment with Chapa
        const chapaRes = await axios.get(
          `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_CHAPA_KEY}`,
            },
          }
        );

        if (chapaRes.data?.data?.status === "success") {
          // Payment successful - now join the challenge
          const joinRes = await axios.post(
            `${API_URL}/api/equb/join`,
            {
              challengeId,
              paymentRef: tx_ref,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (joinRes.status === 200) {
            setStatus("success");
            toast.success(
              "🎉 Successfully joined the challenge! Payment confirmed."
            );

            // Clear session storage
            sessionStorage.removeItem(`equb_payment_${tx_ref}`);

            // Redirect after 3 seconds
            setTimeout(() => navigate("/"), 3000);
          } else {
            throw new Error("Failed to join challenge");
          }
        } else {
          setStatus("failed");
          toast.error("Payment was not successful. Please try again.");
          setTimeout(() => navigate("/"), 3000);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setStatus("failed");
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Payment verification failed"
        );
        setTimeout(() => navigate("/"), 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#f8f9fa" }}
    >
      <div className="card shadow-lg p-5 text-center" style={{ maxWidth: 500 }}>
        {loading && (
          <>
            <div className="spinner-border text-primary mb-4" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h4 className="fw-bold mb-2">Verifying Payment</h4>
            <p className="text-muted">
              Please wait while we confirm your payment and process your challenge participation...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              className="rounded-circle d-flex justify-content-center align-items-center mb-4"
              style={{
                width: 80,
                height: 80,
                background: "#d4edda",
                margin: "0 auto",
              }}
            >
              <i className="bi bi-check-circle text-success" style={{ fontSize: 40 }} />
            </div>
            <h4 className="fw-bold text-success mb-2">Payment Successful!</h4>
            <p className="text-muted mb-3">
              You have successfully joined the crowdfunded challenge. Your slot has been reserved!
            </p>
            <p className="small text-muted">
              Redirecting to home page in a few seconds...
            </p>
          </>
        )}

        {status === "failed" && (
          <>
            <div
              className="rounded-circle d-flex justify-content-center align-items-center mb-4"
              style={{
                width: 80,
                height: 80,
                background: "#f8d7da",
                margin: "0 auto",
              }}
            >
              <i className="bi bi-x-circle text-danger" style={{ fontSize: 40 }} />
            </div>
            <h4 className="fw-bold text-danger mb-2">Payment Failed</h4>
            <p className="text-muted mb-3">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
            <p className="small text-muted">
              Redirecting to home page in a few seconds...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default EqubPaymentCallback;
