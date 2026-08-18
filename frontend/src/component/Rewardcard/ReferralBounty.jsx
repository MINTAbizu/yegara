import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaCopy, FaGift, FaLink, FaShareAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const ReferralBounty = () => {
  const [link, setLink] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLink = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to generate your bounty link.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/api/referral/link`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLink(res.data.url);
      setCode(res.data.code);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not generate referral link.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      toast.success("Bounty link copied.");
    } catch {
      toast.error("Copy failed. Please select the link manually.");
    }
  };

  useEffect(() => {
    generateLink();
  }, []);

  return (
    <section className="container-fluid">
      <div className="bg-white border rounded p-4 shadow-sm">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="bg-primary text-white rounded d-flex align-items-center justify-content-center" style={{ width: 48, height: 48 }}>
            <FaGift />
          </div>
          <div>
            <h2 className="h4 mb-1">Bounty Referral Link</h2>
            <p className="text-muted mb-0">Share your link. When a new user signs up from it, the referral is tracked for rewards.</p>
          </div>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text"><FaLink /></span>
          <input className="form-control" value={link || "Generating your link..."} readOnly />
          <button className="btn btn-outline-primary" type="button" onClick={copyLink} disabled={!link}>
            <FaCopy />
          </button>
        </div>

        {code && <p className="small text-muted mb-4">Referral code: <strong>{code}</strong></p>}

        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-primary d-flex align-items-center gap-2" type="button" onClick={generateLink} disabled={loading}>
            <FaShareAlt />
            {loading ? "Preparing..." : "Refresh Link"}
          </button>
          {link && (
            <a className="btn btn-outline-secondary" href={link} target="_blank" rel="noreferrer">Test Link</a>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReferralBounty;
