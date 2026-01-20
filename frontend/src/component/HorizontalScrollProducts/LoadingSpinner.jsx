import React from "react";
import "./LoadingSpinner.css";

function LoadingSpinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
      <p className="loading-text">Loading products...</p>
    </div>
  );
}

export default LoadingSpinner;
