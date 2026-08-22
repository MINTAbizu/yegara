import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/Authcontext";
import DashboardLayout from "../../../kyc/DashboardLayout";
import "./order.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const AffiliateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("ALL"); // ALL | TODAY | WEEK | MONTH | CUSTOM
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // Global Affiliate Commission Rate (e.g., 10%)
  const COMMISSION_RATE = 0.10;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id && !user?.id) return;
      try {
        const userId = user._id || user.id;
        const response = await axios.get(`${API_URL}/api/orders/seller/${userId}`);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Failed to fetch affiliate data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Referral Link Generation
  const affiliateRefLink = `${window.location.origin}/shop?ref=${user?._id || user?.id || "affiliate"}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateRefLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Date Range & Keyword Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();

    // 1. Timeframe / Date Selection Filtering
    let matchesTime = true;
    if (timeframe === "TODAY") {
      matchesTime = orderDate.toDateString() === today.toDateString();
    } else if (timeframe === "WEEK") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      matchesTime = orderDate >= oneWeekAgo;
    } else if (timeframe === "MONTH") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(today.getDate() - 30);
      matchesTime = orderDate >= oneMonthAgo;
    } else if (timeframe === "CUSTOM" && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      matchesTime = orderDate >= start && orderDate <= end;
    }

    // 2. Search Filter
    const email = order.buyerEmail || order.userId?.email || "";
    const txRef = order.txRef || "";
    const query = searchQuery.toLowerCase();
    const matchesSearch = email.toLowerCase().includes(query) || txRef.toLowerCase().includes(query);

    return matchesTime && matchesSearch;
  });

  // KPI Analytics Calculations
  const grossSales = filteredOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
  const totalCommission = grossSales * COMMISSION_RATE;
  const totalConversions = filteredOrders.length;
  const averageOrderValue = totalConversions > 0 ? grossSales / totalConversions : 0;

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // CSV Export Handler
  const exportToCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ["Transaction Ref,Customer Email,Gross Sale (ETB),Commission (ETB),Status,Date\n"];
    const rows = filteredOrders.map((o) => {
      const sale = Number(o.amount) || 0;
      const comm = sale * COMMISSION_RATE;
      return `"${o.txRef || o._id}","${o.buyerEmail || o.userId?.email || "N/A"}","${sale}","${comm.toFixed(2)}","APPROVED","${new Date(o.createdAt).toLocaleDateString()}"`;
    });

    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `affiliate-payouts-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-3 p-md-4 bg-light min-vh-100">
        
        {/* Navigation & Go Back Bar */}
        <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2 rounded-2 px-3 fw-medium bg-white shadow-sm"
          >
            <span>←</span> Go Back
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="nav nav-pills bg-white p-2 rounded-3 shadow-sm border mb-4 gap-2 flex-nowrap overflow-auto">
          <Link to="/shop" className="nav-link text-dark fw-semibold text-nowrap rounded-2">
            Shop / ሱቅ
          </Link>
          <Link to="/orders" className="nav-link text-dark fw-semibold text-nowrap rounded-2">
            Orders / ትእዛዝ
          </Link>
          <Link to="/listings" className="nav-link text-dark fw-semibold text-nowrap rounded-2">
            የኔ-ሱቅ
          </Link>
          <Link to="/affiliate" className="nav-link active bg-primary text-white fw-semibold text-nowrap rounded-2">
            Affiliate / ሽያጭ
          </Link>
        </div>

        {/* Affiliate Referral Link Generator */}
        <div className="card border-0 shadow-sm rounded-3 mb-4 bg-white">
          <div className="card-body p-3 p-md-4">
            <div className="row align-items-center g-3">
              <div className="col-12 col-lg-5">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge bg-primary-subtle text-primary fw-bold text-uppercase">Your Referral Link</span>
                  <span className="text-muted small">• 10% Commission</span>
                </div>
                <h6 className="fw-bold mb-0 text-dark">Share your unique link to start earning affiliate commissions</h6>
              </div>
              <div className="col-12 col-lg-7">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-0 py-2 rounded-start-3 small fw-medium text-truncate"
                    value={affiliateRefLink}
                    readOnly
                  />
                  <button
                    className={`btn ${copiedLink ? "btn-success" : "btn-primary"} px-4 rounded-end-3 transition-all`}
                    onClick={copyToClipboard}
                  >
                    {copiedLink ? "✓ Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Dashboard Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium text-uppercase">Total Earned Commission</span>
                  <h4 className="fw-bold text-success mb-0 mt-1">
                    {totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2 })} ETB
                  </h4>
                </div>
                <span className="badge bg-success-subtle text-success p-3 rounded-circle fs-5">💎</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium text-uppercase">Gross Referred Sales</span>
                  <h4 className="fw-bold text-dark mb-0 mt-1">{grossSales.toLocaleString()} ETB</h4>
                </div>
                <span className="badge bg-primary-subtle text-primary p-3 rounded-circle fs-5">💳</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium text-uppercase">Conversions (Orders)</span>
                  <h4 className="fw-bold text-dark mb-0 mt-1">{totalConversions}</h4>
                </div>
                <span className="badge bg-info-subtle text-info p-3 rounded-circle fs-5">⚡</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-xl-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium text-uppercase">Avg Order Value (AOV)</span>
                  <h4 className="fw-bold text-dark mb-0 mt-1">
                    {averageOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} ETB
                  </h4>
                </div>
                <span className="badge bg-warning-subtle text-warning p-3 rounded-circle fs-5">📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger & Custom Filter Section */}
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
          <div className="card-header bg-white py-3 px-4 border-bottom">
            <div className="d-flex flex-column gap-3">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Commission Ledger</h5>
                  <p className="text-muted small mb-0">Track conversions, order amounts, and affiliate earnings</p>
                </div>

                <button
                  className="btn btn-sm btn-outline-success rounded-3 py-2 px-3 fw-medium align-self-start align-self-md-auto"
                  onClick={exportToCSV}
                  disabled={filteredOrders.length === 0}
                >
                  📥 Export CSV
                </button>
              </div>

              {/* Advanced Controls Toolbar */}
              <div className="row g-2 align-items-center">
                <div className="col-12 col-sm-6 col-md-3">
                  <select
                    className="form-select form-select-sm bg-light border-0 py-2 rounded-3"
                    value={timeframe}
                    onChange={(e) => {
                      setTimeframe(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="ALL">All Time</option>
                    <option value="TODAY">Today</option>
                    <option value="WEEK">Last 7 Days</option>
                    <option value="MONTH">Last 30 Days</option>
                    <option value="CUSTOM">Custom Date Range</option>
                  </select>
                </div>

                {/* Custom Range Inputs */}
                {timeframe === "CUSTOM" && (
                  <>
                    <div className="col-6 col-sm-3 col-md-2">
                      <input
                        type="date"
                        className="form-control form-control-sm bg-light border-0 py-2 rounded-3"
                        value={startDate}
                        onChange={(e) => {
                          setStartDate(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div className="col-6 col-sm-3 col-md-2">
                      <input
                        type="date"
                        className="form-control form-control-sm bg-light border-0 py-2 rounded-3"
                        value={endDate}
                        onChange={(e) => {
                          setEndDate(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Search Field */}
                <div className={`col-12 ${timeframe === "CUSTOM" ? "col-md-5" : "col-sm-6 col-md-9"}`}>
                  <input
                    type="text"
                    className="form-control form-control-sm bg-light border-0 py-2 rounded-3"
                    placeholder="Search buyer email or transaction ref..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4">Buyer Info</th>
                  <th>Order Value</th>
                  <th>Commission (10%)</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm me-2 text-primary" role="status" />
                      Loading ledger records...
                    </td>
                  </tr>
                ) : currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="text-muted">
                        <p className="mb-1 fw-semibold">No commission records found</p>
                        <span className="small">Try adjusting your date range or search query.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => {
                    const gross = Number(order.amount) || 0;
                    const commission = gross * COMMISSION_RATE;
                    return (
                      <tr key={order._id}>
                        <td className="ps-4">
                          <div className="d-flex flex-column">
                            <span className="fw-medium text-dark">
                              {order.buyerEmail || order.userId?.email || "Referred Customer"}
                            </span>
                            <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                              Ref: {order.txRef || order._id}
                            </span>
                          </div>
                        </td>
                        <td className="fw-semibold text-dark">{gross.toLocaleString()} ETB</td>
                        <td className="fw-bold text-success">+{commission.toFixed(2)} ETB</td>
                        <td>
                          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
                            APPROVED
                          </span>
                        </td>
                        <td className="text-muted small">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-sm btn-light border rounded-2 px-2"
                            title="Copy Ref"
                            onClick={() => navigator.clipboard.writeText(order.txRef || order._id)}
                          >
                            📋
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="card-footer bg-white border-top py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <span className="small text-muted">
              Showing {filteredOrders.length > 0 ? indexOfFirstOrder + 1 : 0} to{" "}
              {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} entries
            </span>

            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-secondary rounded-start-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <button
                className="btn btn-sm btn-outline-secondary rounded-end-2"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AffiliateDashboard;