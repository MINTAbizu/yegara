import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const tokenHeaders = () => {
  const token = localStorage.getItem("token") || localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

const AdminSocialAccountsTable = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/accounts/admin/all`, { headers: tokenHeaders() });
      setAccounts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch social accounts error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const updateStatus = async (id, status) => {
    await axios.patch(`${API_URL}/api/accounts/admin/status/${id}`, { status }, { headers: tokenHeaders() });
    fetchAccounts();
  };

  const filteredAccounts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return accounts.filter((account) => `${account.platform || ""} ${account.username || ""}`.toLowerCase().includes(term));
  }, [accounts, searchTerm]);

  if (loading) return <p className="text-center py-4">Loading social media accounts...</p>;

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="mb-1">Social Media Accounts</h3>
          <p className="text-muted mb-0">Manage social media account sale listings separately.</p>
        </div>
        <input className="form-control form-control-sm" style={{ maxWidth: 280 }} placeholder="Search platform or username..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark"><tr><th>#</th><th>Platform</th><th>Username</th><th>Seller</th><th>Followers</th><th>Price</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {filteredAccounts.map((account, index) => (
              <tr key={account._id}>
                <td>{index + 1}</td>
                <td>{account.platform}</td>
                <td>{account.username}</td>
                <td>{account.sellerId?.name || "Seller"}</td>
                <td>{Number(account.followers || 0).toLocaleString()}</td>
                <td>{Number(account.price || 0).toLocaleString()} ETB</td>
                <td><span className={`badge ${account.status === "available" ? "bg-success" : account.status === "sold" ? "bg-dark" : "bg-secondary"}`}>{account.status}</span></td>
                <td>
                  <select className="form-select form-select-sm" value={account.status} onChange={(e) => updateStatus(account._id, e.target.value)}>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                  </select>
                </td>
              </tr>
            ))}
            {filteredAccounts.length === 0 && <tr><td colSpan="8" className="text-center text-muted py-4">No social accounts found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSocialAccountsTable;
