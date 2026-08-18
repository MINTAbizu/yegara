import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const modeDetails = {
  FLEXIBLE: {
    label: "Crowdfunding",
    badge: "Winner chooses",
    title: "Open crowdfunding round",
    description:
      "Paid participants fund the pool together. After settlement, the winner receives marketplace purchasing credit.",
    prizeLabel: "Marketplace credit",
    checkoutRule: "Winner can purchase any approved product within the funded amount.",
  },
  PRODUCT_LOCKED: {
    label: "Crowdfunding Billing",
    badge: "Product locked",
    title: "Product-specific billing round",
    description:
      "Paid participants fund one selected product. After settlement, the winner can redeem only that locked product.",
    prizeLabel: "Locked product",
    checkoutRule: "Winner checkout is restricted to the selected product.",
  },
};

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} ETB`;

const Metric = ({ label, value }) => (
  <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 14, minWidth: 0 }}>
    <div style={{ color: "#6b7280", fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
    <div style={{ color: "#111827", fontSize: 20, fontWeight: 800, marginTop: 6, overflowWrap: "anywhere" }}>{value}</div>
  </div>
);

const AdvancedEqubWheel = ({ challenge: providedChallenge, participants, winnerIndex, onAnimationComplete }) => {
  const canvasRef = useRef(null);
  const { challengeId: routeChallengeId } = useParams();
  const [searchParams] = useSearchParams();
  const queryChallengeId = searchParams.get("challengeId");
  const challengeId = routeChallengeId || queryChallengeId;

  const [challenge, setChallenge] = useState(providedChallenge || null);
  const [loading, setLoading] = useState(Boolean(!providedChallenge && challengeId));
  const [error, setError] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (providedChallenge) {
      setChallenge(providedChallenge);
      return;
    }

    if (!challengeId) {
      setChallenge(null);
      setLoading(false);
      return;
    }

    const fetchChallenge = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_URL}/api/equb/${challengeId}`);
        setChallenge(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load challenge participants.");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId, providedChallenge]);

  const realParticipants = useMemo(() => {
    const source = participants || challenge?.filledSlots || [];
    return source
      .filter((participant) => participant && (participant._id || participant.id || participant.label || participant.name))
      .map((participant, index) => ({
        id: participant._id || participant.id || `participant-${index}`,
        label: participant.name || participant.label || participant.email || `Participant ${index + 1}`,
        contribution: Number(participant.contribution || challenge?.slotPrice || 0),
      }));
  }, [participants, challenge]);

  const totalSlots = Math.max(realParticipants.length, 1);
  const fundingType = challenge?.fundingType || "FLEXIBLE";
  const activeMode = modeDetails[fundingType] || modeDetails.FLEXIBLE;
  const fundedAmount = realParticipants.length * Number(challenge?.slotPrice || 0);
  const productName = challenge?.productSnapshot?.name || challenge?.productId?.productName || "Selected product";
  const backendWinnerId = challenge?.winnerId?._id || challenge?.winnerId;
  const resolvedWinnerIndex = Number.isInteger(winnerIndex)
    ? winnerIndex
    : realParticipants.findIndex((participant) => participant.id?.toString() === backendWinnerId?.toString());
  const canDraw = realParticipants.length > 0 && resolvedWinnerIndex >= 0;
  const sliceColors = ["#E11D48", "#0EA5E9", "#F59E0B", "#10B981", "#4F46E5", "#D946EF", "#2563EB", "#16A34A"];

  const drawAdvancedWheel = (currentAngle = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const center = canvas.width / 2;
    const radius = center - 20;
    const sliceAngle = (2 * Math.PI) / totalSlots;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(center, center, radius + 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#292524";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.fill();
    ctx.shadowBlur = 0;

    const drawableParticipants = realParticipants.length ? realParticipants : [{ label: "No paid participants" }];
    drawableParticipants.forEach((participant, index) => {
      const angle = currentAngle + index * sliceAngle;
      const gradient = ctx.createRadialGradient(center, center, 10, center, center, radius);
      gradient.addColorStop(0, "#FFFFFF");
      gradient.addColorStop(0.2, sliceColors[index % sliceColors.length]);
      gradient.addColorStop(1, "#111827");

      ctx.beginPath();
      ctx.fillStyle = gradient;
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + sliceAngle);
      ctx.lineTo(center, center);
      ctx.fill();
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + sliceAngle / 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 15px Arial";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 4;
      ctx.textAlign = "center";
      ctx.rotate(Math.PI / 2);
      ctx.fillText(participant.label, 0, -(radius * 0.65));
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(center, center, 22, 0, 2 * Math.PI);
    ctx.fillStyle = "#1c1917";
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    drawAdvancedWheel(0);
  }, [realParticipants, fundingType]);

  const runSpinAnimation = () => {
    if (isSpinning || !canDraw) return;

    setIsSpinning(true);
    setWinner(null);

    const duration = 6000;
    const startTimestamp = performance.now();
    const sliceDegrees = 360 / totalSlots;
    const safeWinnerIndex = Math.min(Math.max(resolvedWinnerIndex, 0), totalSlots - 1);
    const targetDegrees = 8 * 360 + (360 - safeWinnerIndex * sliceDegrees - sliceDegrees / 2);

    const animationTick = (now) => {
      const progress = Math.min((now - startTimestamp) / duration, 1);
      const easeOutQuint = 1 - Math.pow(1 - progress, 5);
      drawAdvancedWheel(((easeOutQuint * targetDegrees) * Math.PI) / 180);

      if (progress < 1) {
        requestAnimationFrame(animationTick);
        return;
      }

      const selectedWinner = realParticipants[safeWinnerIndex];
      setIsSpinning(false);
      setWinner(selectedWinner);
      onAnimationComplete?.(selectedWinner);
    };

    requestAnimationFrame(animationTick);
  };

  if (loading) {
    return <div className="container py-5 text-center">Loading real challenge participants...</div>;
  }

  if (error || (!challenge && !participants)) {
    return (
      <div className="container py-5 text-center">
        <h4 className="fw-bold">Select a real Equb challenge</h4>
        <p className="text-muted mb-0">{error || "Open the wheel with /AdvancedEqubWheel/:challengeId or ?challengeId=... so it can load paid participants."}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 16px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start" }}>
          <section style={{ backgroundColor: "#1c1917", borderRadius: 8, boxShadow: "inset 0 0 20px rgba(0,0,0,0.6)", padding: 20 }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 380, height: 410, display: "flex", justifyContent: "center", margin: "0 auto" }}>
              <div style={{ position: "absolute", top: 0, width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderTop: "35px solid #EF4444", zIndex: 10, filter: "drop-shadow(0px 4px 5px rgba(0,0,0,0.5))" }} />
              <canvas ref={canvasRef} width={380} height={380} style={{ marginTop: 25, borderRadius: "50%", width: "100%", maxWidth: 380, height: "auto" }} />
            </div>

            <button onClick={runSpinAnimation} disabled={isSpinning || !canDraw} style={{ padding: "14px 24px", fontSize: 18, fontWeight: "bold", letterSpacing: 0, backgroundColor: isSpinning || !canDraw ? "#4b5563" : "#F59E0B", color: "#000000", border: "3px solid #78350F", borderRadius: 8, boxShadow: "0 6px 0 #78350F, 0 10px 20px rgba(0,0,0,0.4)", cursor: isSpinning || !canDraw ? "not-allowed" : "pointer", transform: isSpinning ? "translateY(4px)" : "none", transition: "all 0.1s ease", width: "100%" }}>
              {isSpinning ? "Spinning..." : canDraw ? "Reveal Settled Winner" : "Waiting for Backend Winner"}
            </button>
          </section>

          <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24 }}>
            <span style={{ display: "inline-block", background: "#dcfce7", color: "#166534", borderRadius: 6, padding: "5px 9px", fontWeight: 700, fontSize: 12 }}>{activeMode.badge}</span>
            <h2 style={{ margin: "12px 0 8px", color: "#111827" }}>{challenge?.title || activeMode.title}</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>{challenge?.description || activeMode.description}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 22 }}>
              <Metric label="Paid Participants" value={`${realParticipants.length} / ${challenge?.totalSlots || realParticipants.length}`} />
              <Metric label="Funded" value={formatCurrency(fundedAmount)} />
              <Metric label={activeMode.prizeLabel} value={fundingType === "PRODUCT_LOCKED" ? productName : formatCurrency(challenge?.winnerRedemption?.amount || fundedAmount)} />
            </div>

            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 24, paddingTop: 18 }}>
              <h5 style={{ margin: "0 0 10px" }}>{activeMode.label}</h5>
              <p style={{ margin: 0, color: "#4b5563" }}>{activeMode.checkoutRule}</p>
              {!canDraw && <div className="alert alert-warning mt-3 mb-0">Only real paid participants are shown. The draw unlocks after backend settlement sets the winner.</div>}
              {winner && <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: "#fef3c7", color: "#78350f", fontWeight: 700 }}>Winner: {winner.label}. Redemption is ready for {fundingType === "PRODUCT_LOCKED" ? productName : "marketplace checkout"}.</div>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdvancedEqubWheel;
