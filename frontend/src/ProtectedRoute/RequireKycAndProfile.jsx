import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequireKycAndProfile = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) return;

    // If no token, user must login
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first!");
      navigate("/login", { replace: true });
      setLoading(false);
      return;
    }

    // If user has kycSubmitted flag set to true, they are verified
    // Trust the flag from the auth context (already loaded from backend)
    if (user?.kycSubmitted === true) {
      setAllowed(true);
      setLoading(false);
      return;
    }

    // If user doesn't have kycSubmitted=true, redirect to KYC form
    if (user && user.kycSubmitted === false) {
      toast.warning("Please complete your KYC first!");
      navigate("/RecognitionForm", { replace: true });
      setLoading(false);
      return;
    }

    // User data not yet loaded or incomplete
    setLoading(false);
  }, [user, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Checking access...</span>
        </div>
      </div>
    );
  }

  if (!allowed) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </>
  );
};

export default RequireKycAndProfile;
