import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const ReferralLanding = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [referrerName, setReferrerName] = useState("");

  useEffect(() => {
    let active = true;

    const resolveReferral = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/referral/${code}`);
        if (!active) return;

        setReferrerName(res.data.referrerName || "");
        localStorage.setItem("referralCode", res.data.code);

        setTimeout(() => {
          navigate(`/register?ref=${encodeURIComponent(res.data.code)}`, { replace: true });
        }, 900);
      } catch (err) {
        toast.error(err.response?.data?.message || "Referral link is not valid.");
      } finally {
        if (active) setLoading(false);
      }
    };

    resolveReferral();

    return () => {
      active = false;
    };
  }, [code, navigate]);

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="card shadow-sm p-4 text-center" style={{ maxWidth: 440, width: "100%" }}>
        {loading ? (
          <>
            <div className="spinner-border text-primary mx-auto mb-3" role="status" />
            <h1 className="h4 mb-2">Opening your invite</h1>
            <p className="text-muted mb-0">
              {referrerName ? `${referrerName} invited you to Yegara.` : "Taking you to Yegara."}
            </p>
          </>
        ) : (
          <>
            <h1 className="h4 mb-2">Referral link unavailable</h1>
            <p className="text-muted">Please check the link or create a new account directly.</p>
            <Link className="btn btn-primary" to="/register">Go to Register</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralLanding;
