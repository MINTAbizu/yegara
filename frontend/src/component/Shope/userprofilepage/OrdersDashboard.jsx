import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/Authcontext";
import DashboardLayout from "../../../kyc/DashboardLayout";
import "./order.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const OrdersDashboard = () => {
  const { user } = useAuth() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("TODAY"); // "TODAY" | "WEEK" | "ALL"
  const [selectedPurpose, setSelectedPurpose] = useState("ALL");

  // Pagination Controls
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id && !user?.id) return;
      try {
        const userId = user._id || user.id;
        const response = await axios.get(`${API_URL}/api/orders/seller/${userId}`);
        setOrders(response.data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Combined Filter Logic (Date + Purpose + Search)
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();

    // 1. Timeframe Filter
    let matchesTime = true;
    if (timeframe === "TODAY") {
      matchesTime = orderDate.toDateString() === today.toDateString();
    } else if (timeframe === "WEEK") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      matchesTime = orderDate >= oneWeekAgo;
    }

    // 2. Purpose Filter
    const matchesPurpose = selectedPurpose === "ALL" || order.purpose === selectedPurpose;

    // 3. Search Query Filter
    const email = order.buyerEmail || order.userId?.email || "";
    const txRef = order.txRef || "";
    const query = searchQuery.toLowerCase();
    const matchesSearch = email.toLowerCase().includes(query) || txRef.toLowerCase().includes(query);

    return matchesTime && matchesPurpose && matchesSearch;
  });

  // Financial & Count Calculations
  const todayOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Export Filtered Orders to CSV
  const exportToCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ["Transaction Ref,Buyer Email,Amount (ETB),Purpose,Date\n"];
    const rows = filteredOrders.map((o) =>
      `"${o.txRef || o._id}","${o.buyerEmail || o.userId?.email || "N/A"}","${o.amount}","${o.purpose || "PURCHASE"}","${new Date(o.createdAt).toLocaleDateString()}"`
    );

    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="container-fluid p-3 p-md-4">
         <div className="d-flex align-items-center justify-content-between mb-3 gap-2 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2 rounded-2 px-3 fw-medium bg-white shadow-sm"
          >
            <span>←</span> Go Back
          </button>
        </div>
        {/* Banner Alert */}
        <div className="alert alert-primary border-0 shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center rounded-3 mb-4 gap-2">
          <div>
            <h6 className="fw-bold mb-1">ሱቅ ለመክፈት እና ምርት ለመጫን</h6>
            <p className="small text-muted mb-0">To post your products or set up your shop, click below.</p>
          </div>
          <Link to="/shop" className="btn btn-primary btn-sm px-3 rounded-2 fw-medium text-nowrap">
            ሱቅ ክፈት / Open Shop
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="nav nav-pills bg-white p-2 rounded-3 shadow-sm border mb-4 gap-2 flex-nowrap overflow-auto">
          <Link to="/shop" className="nav-link text-dark fw-semibold text-nowrap rounded-2">
            Shop / ሱቅ
          </Link>
          <Link to="/orders" className="nav-link active bg-primary text-white fw-semibold text-nowrap rounded-2">
            Orders / ትእዛዝ
          </Link>
          <Link to="/listings" className="nav-link text-dark fw-semibold text-nowrap rounded-2">
            የኔ-ሱቅ
          </Link>
          <Link to="/affiliate" className="nav-link text-dark fw-semibold text-nowrap rounded-2">
            ሽያጭ
          </Link>
        </div>

        {/* Metrics Grid */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium text-uppercase">Today's Revenue</span>
                  <h4 className="fw-bold text-success mb-0 mt-1">{todayRevenue.toLocaleString()} ETB</h4>
                </div>
                <span className="badge bg-success-subtle text-success p-3 rounded-circle fs-5">💵</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium text-uppercase">Today's Orders</span>
                  <h4 className="fw-bold text-primary mb-0 mt-1">{todayOrders.length}</h4>
                </div>
                <span className="badge bg-primary-subtle text-primary p-3 rounded-circle fs-5">📦</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium text-uppercase">Total Revenue</span>
                  <h4 className="fw-bold text-dark mb-0 mt-1">{totalRevenue.toLocaleString()} ETB</h4>
                </div>
                <span className="badge bg-light text-dark p-3 rounded-circle fs-5">💰</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white">
              <div className="card-body p-3 d-flex align-items-center justify-content-between">
                <div>
                  <span className="text-muted small fw-medium text-uppercase">Total Orders</span>
                  <h4 className="fw-bold text-dark mb-0 mt-1">{orders.length}</h4>
                </div>
                <span className="badge bg-light text-dark p-3 rounded-circle fs-5">📊</span>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table Section */}
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
          {/* Header Controls */}
          <div className="card-header bg-white py-3 px-4 border-bottom">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Order Transactions</h5>
                <p className="text-muted small mb-0">Manage customer payments and crowdfunding entries</p>
              </div>

              {/* Action Toolbar */}
              <div className="d-flex flex-wrap align-items-center gap-2">
                {/* Timeframe Dropdown */}
                <select
                  className="form-select form-select-sm bg-light border-0 py-2 rounded-3"
                  value={timeframe}
                  onChange={(e) => {
                    setTimeframe(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ width: "auto" }}
                >
                  <option value="TODAY">Today</option>
                  <option value="WEEK">Last 7 Days</option>
                  <option value="ALL">All Time</option>
                </select>

                {/* Purpose Dropdown */}
                <select
                  className="form-select form-select-sm bg-light border-0 py-2 rounded-3"
                  value={selectedPurpose}
                  onChange={(e) => {
                    setSelectedPurpose(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ width: "auto" }}
                >
                  <option value="ALL">All Types</option>
                  <option value="DIRECT_PURCHASE">Direct Purchase</option>
                  <option value="CROWDFUND_JOIN">Crowdfund Join</option>
                </select>

                {/* Search Input */}
                <input
                  type="text"
                  className="form-control form-control-sm bg-light border-0 py-2 rounded-3"
                  placeholder="Search email/ref..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ minWidth: "160px" }}
                />

                {/* CSV Export Button */}
                <button
                  className="btn btn-sm btn-outline-success rounded-3 d-flex align-items-center gap-1 py-2 px-3"
                  onClick={exportToCSV}
                  disabled={filteredOrders.length === 0}
                >
                  <span>📥 Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4">Buyer Info</th>
                  <th>Amount</th>
                  <th>Type / Purpose</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">
                      <div className="spinner-border spinner-border-sm me-2 text-primary" role="status" />
                      Loading transactions...
                    </td>
                  </tr>
                ) : currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="text-muted">
                        <p className="mb-1 fw-semibold">No transactions found</p>
                        <span className="small">Try adjusting your filters or search query.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="ps-4">
                        <div className="d-flex flex-column">
                          <span className="fw-medium text-dark">
                            {order.buyerEmail || order.userId?.email || "Customer"}
                          </span>
                          <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                            Ref: {order.txRef || order._id}
                          </span>
                        </div>
                      </td>
                      <td className="fw-bold text-dark">{order.amount} ETB</td>
                      <td>
                        <span
                          className={`badge rounded-pill border ${
                            order.purpose === "CROWDFUND_JOIN"
                              ? "bg-warning-subtle text-warning-emphasis border-warning-subtle"
                              : "bg-success-subtle text-success border-success-subtle"
                          }`}
                        >
                          {order.purpose || "DIRECT_PURCHASE"}
                        </span>
                      </td>
                      <td className="text-muted small">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-inline-flex gap-2">
                          <button
                            className="btn btn-sm btn-light border rounded-2 px-2"
                            title="Copy Ref"
                            onClick={() => navigator.clipboard.writeText(order.txRef || order._id)}
                          >
                            📋
                          </button>
                          <Link
                            to={`/orders/${order._id}`}
                            className="btn btn-sm btn-outline-primary rounded-2 px-3"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
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

export default OrdersDashboard;