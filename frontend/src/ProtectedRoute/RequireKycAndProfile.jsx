import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";

const RequireKycAndProfile = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const checkPermissions = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch current user's KYC
        const res = await axios.get("http://localhost:5000/api/kyc/my-kyc", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // If KYC exists, allow access
        if (res.data) {
          await refreshUser(); // refresh AuthContext user info
          setAllowed(true);
        }
      } catch (err) {
        // If 404 or error, redirect to KYC form
        console.log("KYC check failed:", err.response?.data || err.message);
        alert("Please complete your KYC first!");
        navigate("/RecognitionForm", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, [navigate, refreshUser]);

  if (loading) return <p>Checking access...</p>;
  if (!allowed) return null;

  return children;
};

export default RequireKycAndProfile;
