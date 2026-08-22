import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/Authcontext";
import DashboardLayout from "../../../kyc/DashboardLayout";
import "./order.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const getTxRef = (order) => order.tx_ref || order.txRef || order._id;
const getProductName = (product) => product?.productName || product?.bookName || product?.title || "Sold product";
const getProductImage = (product) => {
  const image = product?.image;
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_URL}/${String(image).replace(/^\/+/, "")}`;
};
const formatProductType = (type) => (type ? type.charAt(0).toUpperCase() + type.slice(1) : "Product");

const OrdersDashboard = () => {
  const { user } = useAuth() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("TODAY");
  const [selectedPurpose, setSelectedPurpose] = useState("ALL");
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

  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const today = new Date();

    let matchesTime = true;
    if (timeframe === "TODAY") {
      matchesTime = orderDate.toDateString() === today.toDateString();
    } else if (timeframe === "WEEK") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      matchesTime = orderDate >= oneWeekAgo;
    }

    const matchesPurpose = selectedPurpose === "ALL" || order.productType === selectedPurpose;
    const email = order.buyerEmail || order.buyerId?.email || "";
    const txRef = getTxRef(order) || "";
    const productName = getProductName(order.product);
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      email.toLowerCase().includes(query) ||
      txRef.toLowerCase().includes(query) ||
      productName.toLowerCase().includes(query);

    return matchesTime && matchesPurpose && matchesSearch;
  });

  const todayOrders = orders.filter(
    (order) => new Date(order.createdAt).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.amount) || 0), 0);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const exportToCSV = () => {
    if (filteredOrders.length === 0) return;

    const headers = ["Product,Transaction Ref,Buyer Email,Amount (ETB),Type,Status,Date\n"];
    const rows = filteredOrders.map((o) =>
      `"${getProductName(o.product)}","${getTxRef(o)}","${o.buyerEmail || o.buyerId?.email || "N/A"}","${o.amount}","${formatProductType(o.productType)}","${o.status || "paid"}","${new Date(o.createdAt).toLocaleDateString()}"`
    );

    const blob = new Blob([headers.concat(rows).join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `sold-products-${new Date().toISOString().slice(0, 10)}.csv`);
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
            <span>{"<-"}</span> Go Back
          </button>
        </div>

        <div className="alert alert-primary border-0 shadow-sm d-flex flex-column flex-sm-row justify-content-between align-items-sm-center rounded-3 mb-4 gap-2">
          <div>
            <h6 className="fw-bold mb-1">Open your shop and add products</h6>
            <p className="small text-muted mb-0">To post your products or set up your shop, click below.</p>
          </div>
          <Link to="/shop" className="btn btn-primary btn-sm px-3 rounded-2 fw-medium text-nowrap">
            Open Shop
          </Link>
        </div>

        <div className="nav nav-pills bg-white p-2 rounded-3 shadow-sm border mb-4 gap-2 flex-nowrap overflow-auto">
          <Link to="/shop" className="nav-link text-dark fw-semibold text-nowrap rounded-2">Shop</Link>
          <Link to="/orders" className="nav-link active bg-primary text-white fw-semibold text-nowrap rounded-2">Orders</Link>
          <Link to="/listings" className="nav-link text-dark fw-semibold text-nowrap rounded-2">My Shop</Link>
          <Link to="/affiliate" className="nav-link text-dark fw-semibold text-nowrap rounded-2">Affiliate</Link>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white"><div className="card-body p-3"><span className="text-muted small fw-medium text-uppercase">Today's Revenue</span><h4 className="fw-bold text-success mb-0 mt-1">{todayRevenue.toLocaleString()} ETB</h4></div></div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white"><div className="card-body p-3"><span className="text-muted small fw-medium text-uppercase">Today's Sales</span><h4 className="fw-bold text-primary mb-0 mt-1">{todayOrders.length}</h4></div></div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white"><div className="card-body p-3"><span className="text-muted small fw-medium text-uppercase">Total Revenue</span><h4 className="fw-bold text-dark mb-0 mt-1">{totalRevenue.toLocaleString()} ETB</h4></div></div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card border-0 shadow-sm rounded-3 h-100 bg-white"><div className="card-body p-3"><span className="text-muted small fw-medium text-uppercase">Sold Products</span><h4 className="fw-bold text-dark mb-0 mt-1">{orders.length}</h4></div></div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">
          <div className="card-header bg-white py-3 px-4 border-bottom">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
              <div>
                <h5 className="fw-bold mb-0 text-dark">Sold Products</h5>
                <p className="text-muted small mb-0">Every paid product order displayed in table format</p>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <select className="form-select form-select-sm bg-light border-0 py-2 rounded-3" value={timeframe} onChange={(e) => { setTimeframe(e.target.value); setCurrentPage(1); }} style={{ width: "auto" }}>
                  <option value="TODAY">Today</option>
                  <option value="WEEK">Last 7 Days</option>
                  <option value="ALL">All Time</option>
                </select>
                <select className="form-select form-select-sm bg-light border-0 py-2 rounded-3" value={selectedPurpose} onChange={(e) => { setSelectedPurpose(e.target.value); setCurrentPage(1); }} style={{ width: "auto" }}>
                  <option value="ALL">All Products</option>
                  <option value="digital">Digital</option>
                  <option value="physical">Physical</option>
                  <option value="gift">Gift</option>
                  <option value="book">Book</option>
                </select>
                <input type="text" className="form-control form-control-sm bg-light border-0 py-2 rounded-3" placeholder="Search product, buyer, ref..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} style={{ minWidth: "180px" }} />
                <button className="btn btn-sm btn-outline-success rounded-3 py-2 px-3" onClick={exportToCSV} disabled={filteredOrders.length === 0}>Export</button>
              </div>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4">Product</th>
                  <th>Buyer</th>
                  <th>Sale Price</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-4 text-muted"><div className="spinner-border spinner-border-sm me-2 text-primary" role="status" />Loading sold products...</td></tr>
                ) : currentOrders.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-5"><p className="mb-1 fw-semibold text-muted">No sold products found</p><span className="small text-muted">Paid product orders will appear here.</span></td></tr>
                ) : (
                  currentOrders.map((order) => {
                    const txRef = getTxRef(order);
                    const productImage = getProductImage(order.product);
                    return (
                      <tr key={order._id}>
                        <td className="ps-4">
                          <div className="d-flex align-items-center gap-3">
                            {productImage ? <img src={productImage} alt={getProductName(order.product)} className="rounded-2 object-fit-cover bg-light border" style={{ width: "44px", height: "44px" }} /> : <div className="rounded-2 bg-light border d-flex align-items-center justify-content-center text-muted fw-bold" style={{ width: "44px", height: "44px" }}>{getProductName(order.product).charAt(0).toUpperCase()}</div>}
                            <div className="d-flex flex-column"><span className="fw-semibold text-dark">{getProductName(order.product)}</span><span className="text-muted small" style={{ fontSize: "0.75rem" }}>Ref: {txRef}</span></div>
                          </div>
                        </td>
                        <td><div className="d-flex flex-column"><span className="fw-medium text-dark">{order.buyerEmail || order.buyerId?.email || "Customer"}</span>{order.buyerId?.name && <span className="text-muted small" style={{ fontSize: "0.75rem" }}>{order.buyerId.name}</span>}</div></td>
                        <td className="fw-bold text-dark">{Number(order.amount || 0).toLocaleString()} ETB</td>
                        <td><span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill">{formatProductType(order.productType)}</span></td>
                        <td><span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">{order.status || "paid"}</span></td>
                        <td className="text-muted small">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="text-end pe-4"><div className="d-inline-flex gap-2"><button className="btn btn-sm btn-light border rounded-2 px-2" title="Copy Ref" onClick={() => navigator.clipboard.writeText(txRef)}>Copy</button><Link to={`/orders/${order._id}`} className="btn btn-sm btn-outline-primary rounded-2 px-3">View</Link></div></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="card-footer bg-white border-top py-3 px-4 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
            <span className="small text-muted">Showing {filteredOrders.length > 0 ? indexOfFirstOrder + 1 : 0} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} entries</span>
            <div className="btn-group">
              <button className="btn btn-sm btn-outline-secondary rounded-start-2" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>Prev</button>
              <button className="btn btn-sm btn-outline-secondary rounded-end-2" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersDashboard;
