import React from "react";
import { useAuth } from "../Context/Authcontext";
import { Navigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import OrdersDashboard from "../component/Shope/userprofilepage/OrdersDashboard";
const ShopPage = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user.kycSubmitted) {
    return <Navigate to="/RecognitionForm" replace />;
  }

  if (!user.profileCompleted) {
    return <Navigate to="/UserProfile" replace />;
  }

  return (
    <DashboardLayout>
      <OrdersDashboard />
    </DashboardLayout>
  );
};
export default ShopPage;
