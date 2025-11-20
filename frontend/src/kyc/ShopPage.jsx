import React from "react";
import { useAuth } from "../Context/Authcontext";
import { Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import OrdersDashboard from "../component/Shope/userprofilepage/OrdersDashboard";

const ShopPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user?.kycSubmitted || !user?.profileCompleted) {
    alert("Please complete your KYC and Profile first!");
    return <Navigate to="/RecognitionForm" replace />;
  }

  return (
    <DashboardLayout>
    <OrdersDashboard />
    </DashboardLayout>
  );
};

export default ShopPage;
