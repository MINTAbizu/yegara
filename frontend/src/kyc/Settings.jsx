import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaEye,
  FaCog,
  FaUniversity,
  FaMoneyCheckAlt,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

function Settings() {
  const location = useLocation();

  const sidebarItems = [
    { name: "Home", path: "/", icon: <FaHome />, color: "#6C5DD3" },
    { name: "Create Pro Account", path: "/UpgradePro", icon: <FaUserPlus />, color: "#FF6B6B" },
    { name: "Change Account", path: "/orders", icon: <FaEye />, color: "#4ECDC4" },
    { name: "ADD Account", path: "/UserProfile", icon: <FaCog />, color: "#FFD93D" },
    { name: "Change Bank Account", path: "/bank", icon: <FaUniversity />, color: "#FF6B6B" },
    { name: "Payments", path: "/payments", icon: <FaMoneyCheckAlt />, color: "#6C5DD3" },
    { name: "Help", path: "/help", icon: <FaQuestionCircle />, color: "#4ECDC4" },
    { name: "Logout", path: "/logout", icon: <FaSignOutAlt />, color: "#FF6B6B" },
    { name: "Legal Issue", path: "/legal", icon: <FaQuestionCircle />, color: "#FFD93D" },
    { name: "Privacy", path: "/privacy", icon: <FaQuestionCircle />, color: "#6C5DD3" },
  ];

  return (
    <div className="container my-5">
      <div className="row g-4">
        {sidebarItems.map((item, index) => (
          <div
            key={index}
            className="col-6 col-sm-4 col-md-3 col-lg-2"
          >
            <Link
              to={item.path}
              className={`card text-center text-white p-4 shadow-lg border-0 d-flex flex-column align-items-center justify-content-center`}
              style={{
                backgroundColor: item.color,
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
              }}
            >
              <div className="fs-3 mb-2">{item.icon}</div>
              <div className="fw-bold">{item.name}</div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Settings;
