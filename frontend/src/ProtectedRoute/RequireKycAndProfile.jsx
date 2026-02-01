import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const RequireKycAndProfile = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const checkPermissions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first!");
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/kyc/my-kyc`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If KYC exists, allow access
        if (res.data) {
          await refreshUser(); // refresh AuthContext user info
          setAllowed(true);
        } else {
          toast.warning("Please complete your KYC first!");
          navigate("/RecognitionForm", { replace: true });
        }
      } catch (err) {
        console.log("KYC check failed:", err.response?.data || err.message);
        toast.warning("Please complete your KYC first!");
        navigate("/RecognitionForm", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [navigate, refreshUser]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Checking access...</span>
        </div>
      </div>
    );

  if (!allowed) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {children}
    </>
  );
};

export default RequireKycAndProfile;
