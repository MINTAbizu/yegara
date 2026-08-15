import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import CrowdfundTimer from "./CrowdfundTimer";
import EqubSlotProgress from "./EqubSlotProgress";

const API_URL = import.meta.env.VITE_API_URL;

const CrowdfundedProductsList = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${API_URL}/api/equb/active`);
        
        // Normalize response: ensure it's always an array
        const data = Array.isArray(res.data) ? res.data : [];
        setChallenges(data.length > 0 ? data : []);
      } catch (err) {
        console.error("Error fetching crowdfunded products:", err.message);
        setError(err.message);
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  if (loading) {
    return (
      <div className="container my-5">
        <h3 className="text-center mb-4">Crowdfunded Products</h3>
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || challenges.length === 0) {
    return (
      <div className="container my-5">
        <h3 className="text-center mb-4">Crowdfunded Products</h3>
        <p className="text-center text-muted">
          {error ? "Unable to load crowdfunded products." : "No active crowdfunded challenges yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4 fw-bold">Crowdfunded Products</h3>
      <p className="text-center text-muted mb-4">
        Join hourly Equb challenges to win premium products at group rates.
      </p>

      <div className="row g-4">
        {challenges.map((challenge) => {
          const creatorName = challenge.creatorId?.name || "Seller";
          const filledCount = Array.isArray(challenge.filledSlots)
            ? challenge.filledSlots.length
            : 0;
          const totalPrice = challenge.slotPrice * challenge.totalSlots;

          return (
            <div key={challenge._id} className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm border-0 rounded-3 h-100 d-flex flex-column">
                <div
                  className="card-header bg-light border-0 p-3"
                  style={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: "12px 12px 0 0",
                  }}
                >
                  <span className="badge bg-white text-dark me-2">
                    Equb Challenge
                  </span>
                  <span className="text-white small">
                    {challenge.status === "PENDING" ? "Active" : challenge.status}
                  </span>
                </div>

                <div className="card-body flex-grow-1">
                  <h5 className="card-title fw-bold mb-2 text-dark">
                    {challenge.title || "Untitled Challenge"}
                  </h5>

                  <p className="card-text text-muted small mb-3">
                    {challenge.description
                      ? challenge.description.substring(0, 80) + "..."
                      : "No description"}
                  </p>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">Created by</small>
                      <small className="fw-bold text-dark">{creatorName}</small>
                    </div>
                  </div>

                  <div className="mb-3">
                    <EqubSlotProgress
                      filledSlots={filledCount}
                      totalSlots={challenge.totalSlots}
                    />
                  </div>

                  <div className="mb-3">
                    <CrowdfundTimer
                      expiresAt={challenge.expiresAt}
                      compact={true}
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <small className="text-muted d-block">Slot Price</small>
                      <strong className="text-primary">
                        {challenge.slotPrice?.toLocaleString()} Birr
                      </strong>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">Total Prize</small>
                      <strong className="text-success">
                        {totalPrice?.toLocaleString()} Birr
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-light border-top-0 p-3 pt-0">
                  <button
                    className="btn btn-primary w-100 rounded-2"
                    disabled={filledCount >= challenge.totalSlots}
                  >
                    {filledCount >= challenge.totalSlots
                      ? "Slots Full"
                      : `Join Challenge (${challenge.totalSlots - filledCount} slots)`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CrowdfundedProductsList;
