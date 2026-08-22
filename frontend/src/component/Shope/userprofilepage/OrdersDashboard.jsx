// import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../Context/Authcontext";
import DashboardLayout from "../../../kyc/DashboardLayout";
import "./order.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const OrdersDashboard = () => {
  const { user } = useAuth() || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id && !user?.id) return;
      try {
        const userId = user._id || user.id;
        // Fetch verified orders for the seller
        const response = await axios.get(`${API_URL}/api/orders/seller/${userId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Filter orders created today
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt).toDateString();
    return orderDate === new Date().toDateString();
  });

  return (
    <DashboardLayout>
      <div className="orders-container">
        <h2 className="mb-4">to create post shop click on ሱቅ</h2>
        
        <div className="orders-tabs">
          <Link to="/shop" className="orders-tab-btn">Shop <br />ሱቅ kefet</Link>
          <Link to="/orders" className="orders-tab-btn active">Orders <br />ትእዛዝ</Link>
          <Link to="/listings" className="orders-tab-btn">የኔ-ሱቅ</Link>
          <Link to="/affiliate" className="orders-tab-btn">ሽያጭ</Link>
        </div>

        {/* Dynamic Stats */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{todayOrders.length}</h5>
                <p className="card-text">Today's Orders</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{orders.length}</h5>
                <p className="card-text">Total Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title mb-3">Today Orders</h5>

            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Info</th>
                    <th>Price/Product</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">Loading orders...</td>
                    </tr>
                  ) : todayOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted">
                        No orders recorded today.
                      </td>
                    </tr>
                  ) : (
                    todayOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order.buyerEmail || order.userId?.email || "Buyer"}</td>
                        <td>{order.amount} ETB</td>
                        <td><span className="badge bg-success">{order.purpose || "PURCHASE"}</span></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/orders/${order._id}`} className="btn btn-sm btn-outline-primary">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersDashboard;