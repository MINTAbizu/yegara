import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;
const tokenHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

const AdminCrowdfundingList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/equb/admin/all`, { headers: tokenHeaders() });
        setChallenges(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch crowdfunding error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const filteredChallenges = useMemo(() => {
    if (filter === "all") return challenges;
    return challenges.filter((challenge) => challenge.fundingType === filter);
  }, [challenges, filter]);

  if (loading) return <p className="text-center py-4">Loading crowdfunding rounds...</p>;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="mb-1">Crowdfunding</h3>
          <p className="text-muted mb-0">View open crowdfunding and seller billing rounds separately from products.</p>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="FLEXIBLE">Crowdfunding</option>
            <option value="PRODUCT_LOCKED">Billing</option>
          </select>
          <Link className="btn btn-sm btn-primary" to="/AdminCrowdfundingCreate">Create</Link>
        </div>
      </div>

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark"><tr><th>#</th><th>Title</th><th>Mode</th><th>Product</th><th>Creator</th><th>Slots</th><th>Slot Price</th><th>Status</th><th>Expires</th></tr></thead>
          <tbody>
            {filteredChallenges.map((challenge, index) => {
              const filled = Array.isArray(challenge.filledSlots) ? challenge.filledSlots.length : 0;
              return (
                <tr key={challenge._id}>
                  <td>{index + 1}</td>
                  <td>{challenge.title}</td>
                  <td><span className="badge bg-info text-dark">{challenge.fundingType === "PRODUCT_LOCKED" ? "Billing" : "Crowdfunding"}</span></td>
                  <td>{challenge.productSnapshot?.name || challenge.productId?.productName || challenge.productId?.bookName || "Any eligible product"}</td>
                  <td>{challenge.creatorId?.name || "Admin"}</td>
                  <td>{filled}/{challenge.totalSlots}</td>
                  <td>{Number(challenge.slotPrice || 0).toLocaleString()} ETB</td>
                  <td><span className={`badge ${challenge.status === "PENDING" ? "bg-primary" : challenge.status === "SUCCESS" ? "bg-success" : "bg-secondary"}`}>{challenge.status}</span></td>
                  <td>{challenge.expiresAt ? new Date(challenge.expiresAt).toLocaleDateString() : "-"}</td>
                </tr>
              );
            })}
            {filteredChallenges.length === 0 && <tr><td colSpan="9" className="text-center text-muted py-4">No crowdfunding rounds found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCrowdfundingList;
