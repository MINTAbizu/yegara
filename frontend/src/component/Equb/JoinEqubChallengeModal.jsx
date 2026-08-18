import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../Context/Authcontext";
import { toast } from "react-toastify";
import "./JoinEqubChallengeModal.css";

const API_URL = import.meta.env.VITE_API_URL;

const JoinEqubChallengeModal = ({
  challenge,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Confirm, 2: Payment Pending
  const token = localStorage.getItem("token");

  if (!isOpen || !challenge) return null;

  const handleJoinClick = async () => {
    // Step 1: Validate
    if (!user) {
      toast.error("Please login to join a challenge.");
      return;
    }

    if (!token) {
      toast.error("Authentication required. Please login again.");
      return;
    }

    setLoading(true);

    try {
      // Step 2: Initiate payment through Chapa
      // Create a payment for the slot price
      const tx_ref = `equb_${challenge._id}_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      const paymentData = {
        amount: challenge.slotPrice,
        currency: "ETB",
        email: user.email,
        tx_ref,
        first_name: user.name?.split(" ")[0] || "User",
        last_name: user.name?.split(" ")[1] || "Name",
        title: `Join Equb Challenge: ${challenge.title}`,
        description: `Slot Price: ${challenge.slotPrice} ETB`,
        callback_url: `${window.location.origin}/equb/payment-callback?challengeId=${challenge._id}&tx_ref=${tx_ref}`,
        return_url: `${window.location.origin}/equb/payment-callback?challengeId=${challenge._id}&tx_ref=${tx_ref}`,
      };

      // Initialize payment with Chapa
      const chapaRes = await axios.post(
        "https://api.chapa.co/v1/transaction/initialize",
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_CHAPA_KEY}`,
          },
        }
      );

      if (chapaRes.data?.data?.checkout_url) {
        // Store payment reference in session for verification after redirect
        sessionStorage.setItem(
          `equb_payment_${tx_ref}`,
          JSON.stringify({
            challengeId: challenge._id,
            userId: user._id,
            slotPrice: challenge.slotPrice,
            tx_ref,
          })
        );

        // Redirect to Chapa payment
        setStep(2);
        setTimeout(() => {
          window.location.href = chapaRes.data.data.checkout_url;
        }, 1500);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Payment initiation failed. Please try again."
      );
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="equb-modal-overlay" onClick={onClose}>
        <div
          className="equb-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Redirecting...</span>
            </div>
            <h5>Redirecting to payment gateway...</h5>
            <p className="text-muted small">
              You will be redirected to Chapa to complete your payment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const filledCount = Array.isArray(challenge.filledSlots)
    ? challenge.filledSlots.length
    : 0;
  const remainingSlots = challenge.totalSlots - filledCount;
  const creatorName = challenge.creatorId?.name || "Seller";
  const isProductLocked = challenge.fundingType === "PRODUCT_LOCKED";
  const productName = challenge.productSnapshot?.name || challenge.productId?.productName || "Selected product";

  return (
    <div className="equb-modal-overlay" onClick={onClose}>
      <div
        className="equb-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="equb-modal-header">
          <h5 className="fw-bold mb-0">Join {isProductLocked ? "Crowdfunding Billing" : "Crowdfunding"}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          />
        </div>

        {/* Body */}
        <div className="equb-modal-body">
          {/* Challenge Summary */}
          <div className="challenge-summary card border-light shadow-sm p-3 mb-4">
            <h6 className="fw-bold text-dark mb-3">Challenge Details</h6>

            <div className="challenge-info">
              <div className="info-row">
                <span className="info-label">Challenge</span>
                <span className="info-value fw-bold text-dark">
                  {challenge.title}
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Created by</span>
                <span className="info-value">{creatorName}</span>
              </div>

              <div className="info-row">
                <span className="info-label">Slot Price</span>
                <span className="info-value text-success fw-bold">
                  {challenge.slotPrice.toLocaleString()} ETB
                </span>
              </div>

              <div className="info-row">
                <span className="info-label">Available Slots</span>
                <span className="info-value text-info fw-bold">
                  {remainingSlots} / {challenge.totalSlots}
                </span>
              </div>

              <div className="info-row"><span className="info-label">Total Prize Pool</span><span className="info-value text-primary fw-bold">{(challenge.slotPrice * challenge.totalSlots).toLocaleString()} ETB</span></div>{isProductLocked && (<div className="info-row"><span className="info-label">Winner can buy</span><span className="info-value fw-bold text-dark">{productName}</span></div>)}
            </div>
          </div>

          {/* User Confirmation */}
          <div className="user-confirmation card border-light p-3 mb-4">
            <div className="d-flex align-items-center gap-3">
              <div
                className="avatar bg-primary text-white d-flex justify-content-center align-items-center rounded-circle"
                style={{ width: 45, height: 45, fontSize: "18px" }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <small className="text-muted d-block">Joining as</small>
                <strong className="text-dark">{user?.name || "User"}</strong>
                <br />
                <small className="text-muted">{user?.email}</small>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="alert alert-info border-0 mb-4">
            <strong>Ready to join?</strong>
            <p className="mb-0 small mt-2">
              Clicking "Proceed to Payment" will redirect you to our secure payment gateway (Chapa) to complete your {challenge.slotPrice} ETB slot payment. Your participation will be confirmed immediately after successful payment. The winner will receive {isProductLocked ? `checkout access for ${productName}` : "marketplace purchasing credit"}.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="equb-modal-footer">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleJoinClick}
            disabled={loading || remainingSlots <= 0}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                Processing...
              </>
            ) : remainingSlots <= 0 ? (
              "No Slots Available"
            ) : (
              "Proceed to Payment"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinEqubChallengeModal;



