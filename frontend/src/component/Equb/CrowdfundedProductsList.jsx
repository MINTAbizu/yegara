import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import CrowdfundTimer from "./CrowdfundTimer";
import EqubSlotProgress from "./EqubSlotProgress";
import JoinEqubChallengeModal from "./JoinEqubChallengeModal";

const API_URL = import.meta.env.VITE_API_URL;

const CrowdfundedProductsList = ({ mode = "FLEXIBLE" }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const isBillingPage = mode === "PRODUCT_LOCKED";
  const pageTitle = isBillingPage ? "Crowdfunding Billing" : "Crowdfunding";
  const pageDescription = isBillingPage
    ? "Join seller product-locked billing rounds. The winner gets checkout access for the selected product."
    : "Join platform crowdfunding rounds. The winner receives marketplace purchasing credit and can buy a product.";

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API_URL}/api/equb/active`);
      const data = Array.isArray(res.data) ? res.data : [];
      setChallenges(data.filter((challenge) => challenge.fundingType === mode));
    } catch (err) {
      console.error("Error fetching crowdfunded products:", err.message);
      setError(err.response?.data?.message || err.message);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, [mode]);

  useEffect(() => {
    const challengeId = new URLSearchParams(location.search).get("challengeId");
    if (!challengeId || challenges.length === 0 || modalOpen) return;

    const challenge = challenges.find((item) => item._id === challengeId);
    if (challenge) openJoinModal(challenge);
  }, [challenges, location.search, modalOpen]);

  const openJoinModal = (challenge) => {
    setSelectedChallenge(challenge);
    setModalOpen(true);
  };

  const closeJoinModal = () => {
    setModalOpen(false);
    setSelectedChallenge(null);
  };

  if (loading) {
    return (
      <div className="container my-5">
        <h3 className="text-center mb-4">{pageTitle}</h3>
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
        <h3 className="text-center mb-4">{pageTitle}</h3>
        <p className="text-center text-muted">
          {error ? `Unable to load ${pageTitle.toLowerCase()}.` : `No active ${pageTitle.toLowerCase()} rounds yet.`}
        </p>
        <p className="text-center small text-muted mb-0">{pageDescription}</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h3 className="text-center mb-4 fw-bold">{pageTitle}</h3>
      <p className="text-center text-muted mb-4">{pageDescription}</p>

      <div className="row g-4">
        {challenges.map((challenge) => {
          const creatorName = challenge.creatorId?.name || (isBillingPage ? "Seller" : "Platform owner");
          const filledCount = Array.isArray(challenge.filledSlots) ? challenge.filledSlots.length : 0;
          const totalPrice = Number(challenge.slotPrice || 0) * Number(challenge.totalSlots || 0);
          const remainingSlots = Number(challenge.totalSlots || 0) - filledCount;
          const isFull = remainingSlots <= 0;
          const isProductLocked = challenge.fundingType === "PRODUCT_LOCKED";

          return (
            <div key={challenge._id} className="col-12 col-sm-6 col-lg-4">
              <div className="card shadow-sm border-0 rounded-3 h-100 d-flex flex-column">
                <div className="card-header bg-light border-0 p-3" style={{ background: "linear-gradient(135deg, #2563eb 0%, #10b981 100%)", borderRadius: "12px 12px 0 0" }}>
                  <span className="badge bg-white text-dark me-2">{isProductLocked ? "Crowdfunding Billing" : "Crowdfunding"}</span>
                  <span className="text-white small">{challenge.status === "PENDING" ? "Active" : challenge.status}</span>
                </div>

                <div className="card-body flex-grow-1">
                  <h5 className="card-title fw-bold mb-2 text-dark">{challenge.title || "Untitled Challenge"}</h5>
                  <p className="card-text text-muted small mb-3">
                    {challenge.description ? `${challenge.description.substring(0, 80)}...` : "No description"}
                  </p>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <small className="text-muted">{isBillingPage ? "Seller" : "Created by"}</small>
                      <small className="fw-bold text-dark">{creatorName}</small>
                    </div>
                    {isProductLocked && (
                      <div className="d-flex justify-content-between mb-2 gap-3">
                        <small className="text-muted">Locked product</small>
                        <small className="fw-bold text-dark text-end">{challenge.productSnapshot?.name || challenge.productId?.productName || "Selected product"}</small>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <EqubSlotProgress filledSlots={filledCount} totalSlots={challenge.totalSlots} />
                  </div>

                  <div className="mb-3">
                    <CrowdfundTimer expiresAt={challenge.expiresAt} compact />
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <small className="text-muted d-block">Slot Price</small>
                      <strong className="text-primary">{Number(challenge.slotPrice || 0).toLocaleString()} Birr</strong>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">{isBillingPage ? "Product Pool" : "Buying Credit"}</small>
                      <strong className="text-success">{totalPrice.toLocaleString()} Birr</strong>
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-light border-top-0 p-3 pt-0">
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary rounded-2" disabled={isFull} onClick={() => openJoinModal(challenge)}>
                      {isFull ? "Slots Full" : isBillingPage ? `Join Billing (${remainingSlots} slots)` : `Join Crowdfunding (${remainingSlots} slots)`}
                    </button>
                    <Link className="btn btn-outline-dark rounded-2" to={`/AdvancedEqubWheel/${challenge._id}`}>
                      View Draw Wheel
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <JoinEqubChallengeModal
        challenge={selectedChallenge}
        isOpen={modalOpen}
        onClose={closeJoinModal}
        onSuccess={() => {
          closeJoinModal();
          fetchChallenges();
        }}
      />
    </div>
  );
};

export default CrowdfundedProductsList;
