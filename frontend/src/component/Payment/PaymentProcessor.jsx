import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/Authcontext";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const getPaymentErrorMessage = (error) => {
  const message = error.response?.data?.message;
  if (message && typeof message === "object") {
    const firstField = Object.keys(message)[0];
    const firstError = Array.isArray(message[firstField]) ? message[firstField][0] : message[firstField];
    return firstError || "Unable to start payment.";
  }
  return message || error.message || "Unable to start payment.";
};

const PaymentProcessor = ({
  purpose,
  amount,
  targetId,
  userId,
  email,
  firstName,
  className = "btn btn-primary",
  children,
  disabled = false,
}) => {
  const { user } = useAuth() || {};
  const [loading, setLoading] = useState(false);

  const startPayment = async () => {
    const resolvedUserId = userId || user?._id || user?.id;
    const resolvedEmail = email || user?.email;
    const resolvedFirstName = firstName || user?.name?.split(" ")?.[0] || "Yegara";

    if (!resolvedUserId || !resolvedEmail) {
      toast.error("Please log in before starting payment.");
      return;
    }

    if (!purpose || !amount || !targetId) {
      toast.error("Missing payment details.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/payments/initialize`, {
        userId: resolvedUserId,
        amount,
        email: resolvedEmail,
        firstName: resolvedFirstName,
        purpose,
        targetId,
      });

      const checkoutUrl = response.data?.checkout_url;
      if (!checkoutUrl) throw new Error("Checkout URL was not returned.");

      sessionStorage.setItem(
        `payment_${response.data.tx_ref}`,
        JSON.stringify({ purpose, targetId, amount, userId: resolvedUserId })
      );

      window.location.href = checkoutUrl;
    } catch (error) {
      toast.error(getPaymentErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" className={className} onClick={startPayment} disabled={disabled || loading}>
      {loading ? "Starting payment..." : children || "Pay with Chapa"}
    </button>
  );
};

export default PaymentProcessor;
