import React from 'react'
import { Link } from 'react-router-dom';
import { FaHome, FaTachometerAlt, FaUserPlus, FaEye, FaCog, FaUniversity, FaMoneyCheckAlt, FaQuestionCircle, FaBars, FaTimes } from "react-icons/fa";

function Settings() {
     const sidebarItems = [
    { name: "Home", path: "/", icon: <FaHome /> },
   
    { name: "Create Pro Account", path: "/create-pro", icon: <FaUserPlus /> },
   
    { name: "Change Account", path: "/orders", icon: <FaEye /> },
    { name: "ADDAccount", path: "/UserProfile", icon: <FaCog /> },
    { name: "ChangeBankAccount", path: "/bank", icon: <FaUniversity /> },
    { name: "Payments", path: "/payments", icon: <FaMoneyCheckAlt /> },
    { name: "Help", path: "/help", icon: <FaQuestionCircle /> },
    { name: "Logout", path: "/help", icon: <FaQuestionCircle /> },
    { name: "Legal-issue", path: "/help", icon: <FaQuestionCircle /> },
    { name: "Privacy", path: "/help", icon: <FaQuestionCircle /> },
  ];
  return (
    <div>
         <ul className="list-unstyled">
          {sidebarItems.map((item, index) => (
            <li key={index} className="mb-1">
              <Link
                to={item.path}
                className={`d-flex align-items-center gap-2 p-2 rounded text-decoration-none ${
                  location.pathname === item.path ? "bg-primary text-white" : "text-dark"
                }`}
                // onClick={(e) => {
                //   setSidebarOpen(false); // close sidebar on mobile
                //   // Intercept shop link to enforce KYC/profile completion
                //   if (item.name === "Shope") handleShopClick(e);
                // }}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      
    </div>
  )
}

export default Settings
