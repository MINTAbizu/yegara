import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Context/Authcontext';

const RequireKycAndProfile = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user hasn't submitted KYC, redirect to KYC form
  if (!user.kycSubmitted) {
    return <Navigate to="/RecognitionForm" state={{ from: location }} replace />;
  }

  // If user hasn't completed profile, redirect to profile form
  // Note: backend now exposes both `profileSubmitted` (exists) and `profileApproved`.
  // Allow access if profile has been submitted; if you prefer to require admin approval,
  // change this to check `!user.profileApproved` instead.
  if (!user.profileSubmitted && !user.profileApproved) {
    return <Navigate to="/UserProfile" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireKycAndProfile;
