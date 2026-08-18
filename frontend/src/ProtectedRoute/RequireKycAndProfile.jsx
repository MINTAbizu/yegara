import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequireKycAndProfile = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    const token = localStorage.getItem("token");
    if (!token || !user) {
      setAllowed(false);
      setLoading(false);
      logout?.();
      toast.error("Your session expired. Please login again.");
      navigate("/login", { replace: true });
      return;
    }

    if (user.kycSubmitted === true) {
      setAllowed(true);
      setLoading(false);
      return;
    }

    setAllowed(false);
    setLoading(false);
    toast.warning("Please complete your KYC first!");
    navigate("/RecognitionForm", { replace: true });
  }, [user, authLoading, navigate, logout]);

  if (loading || authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Checking access...</span>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-muted">Redirecting...</div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </>
  );
};

export default RequireKycAndProfile;
