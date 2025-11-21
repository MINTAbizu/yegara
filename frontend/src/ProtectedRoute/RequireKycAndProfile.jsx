import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const ShopGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        // const kyc = await axios.get(`${API_URL}/api/kyc/my-kyc`);
        // const profile = await axios.get("/api/profile/my-profile");
       

        const kyc = await axios.get(`${API_URL}/api/kyc/my-kyc`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
                if (!kyc.data ) {
          alert("Please complete your KYC and Profile first!");
          return navigate("/RecognitionForm");
        }

        setAllowed(true);
      } catch (err) {
        alert("Please complete your KYC and Profile first!");
        navigate("/orders");
      } finally {
        setLoading(false);
      }
    };

    checkPermissions();
  }, []);

  if (loading) return <p>Checking access...</p>;
  if (!allowed) return null;

  return children;
};

export default ShopGuard;
