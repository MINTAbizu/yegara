import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import OrdersDashboard from "../component/Shope/userprofilepage/OrdersDashboard";

const ShopPage = () => {
  const { user, loading } = useAuth();
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (!user.kycSubmitted) return navigate("/RecognitionForm", { replace: true });
      setChecked(true);
    }
  }, [loading, user, navigate]);

  if (loading || !checked) return <div>Loading...</div>;

  return (
    <DashboardLayout>
      <OrdersDashboard />
    </DashboardLayout>
  );
};

export default ShopPage;
