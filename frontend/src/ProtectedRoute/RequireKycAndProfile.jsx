import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ShopGuard = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const kyc = await axios.get("/api/kyc/my-kyc");
        // const profile = await axios.get("/api/profile/my-profile");

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
