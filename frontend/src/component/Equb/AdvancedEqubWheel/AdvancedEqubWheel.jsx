import React, { useEffect, useMemo, useRef, useState } from "react";

const demoParticipants = [
  { label: "Amanuel", contribution: 1000 },
  { label: "Saron", contribution: 1000 },
  { label: "Miki", contribution: 1000 },
  { label: "Bethlehem", contribution: 1000 },
  { label: "Nahom", contribution: 1000 },
  { label: "Hana", contribution: 1000 },
  { label: "Yonas", contribution: 1000 },
  { label: "Liya", contribution: 1000 },
];

const modeDetails = {
  flexible: {
    label: "Crowdfunding",
    badge: "Winner chooses",
    title: "Open crowdfunding round",
    description:
      "Members fund the pool together. When the round closes, the winner receives purchasing power and can buy any eligible marketplace item.",
    prizeLabel: "Flexible purchase credit",
    checkoutRule: "Winner can purchase any approved product within the funded amount.",
  },
  productLocked: {
    label: "Crowdfunding Billing",
    badge: "Product locked",
    title: "Product-specific billing round",
    description:
      "Members fund one selected product. When the round closes, the winner can redeem only that product, keeping seller billing and fulfillment clean.",
    prizeLabel: "Selected product checkout",
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

const AdvancedEqubWheel = ({
  participants = demoParticipants,
  winnerIndex = 2,
  onAnimationComplete,
}) => {
  const canvasRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedMode, setSelectedMode] = useState("flexible");
  const [winner, setWinner] = useState(null);

  const normalizedParticipants = useMemo(
    () =>
      (participants.length ? participants : demoParticipants).map((participant, index) => ({
        ...participant,
        label: participant.label || participant.name || `Slot ${index + 1}`,
      })),
    [participants]
  );

  const totalSlots = normalizedParticipants.length || 8;
  const slotPrice = 1000;
  const fundedAmount = normalizedParticipants.reduce(
    (sum, participant) => sum + Number(participant.contribution || slotPrice),
    0
  );
  const activeMode = modeDetails[selectedMode];
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

    normalizedParticipants.forEach((participant, index) => {
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
    const centerGrad = ctx.createLinearGradient(center - 20, center - 20, center + 20, center + 20);
    centerGrad.addColorStop(0, "#78716c");
    centerGrad.addColorStop(0.5, "#1c1917");
    centerGrad.addColorStop(1, "#78716c");
    ctx.fillStyle = centerGrad;
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  useEffect(() => {
    drawAdvancedWheel(0);
  }, [normalizedParticipants, selectedMode]);

  const runSpinAnimation = () => {
    if (isSpinning || winnerIndex === -1) return;

    setIsSpinning(true);
    setWinner(null);

    const duration = 6000;
    const startTimestamp = performance.now();
    const sliceDegrees = 360 / totalSlots;
    const safeWinnerIndex = Math.min(Math.max(winnerIndex, 0), totalSlots - 1);
    const targetDegrees = 8 * 360 + (360 - safeWinnerIndex * sliceDegrees - sliceDegrees / 2);

    const animationTick = (now) => {
      const elapsed = now - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuint = 1 - Math.pow(1 - progress, 5);
      const currentRadians = ((easeOutQuint * targetDegrees) * Math.PI) / 180;

      drawAdvancedWheel(currentRadians);

      if (progress < 1) {
        requestAnimationFrame(animationTick);
        return;
      }

      const selectedWinner = normalizedParticipants[safeWinnerIndex];
      setIsSpinning(false);
      setWinner(selectedWinner);
      onAnimationComplete?.(selectedWinner);
    };

    requestAnimationFrame(animationTick);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "32px 16px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start" }}>
          <section style={{ backgroundColor: "#1c1917", borderRadius: 8, boxShadow: "inset 0 0 20px rgba(0,0,0,0.6)", padding: 20 }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 380, height: 410, display: "flex", justifyContent: "center", margin: "0 auto" }}>
              <div style={{ position: "absolute", top: 0, width: 0, height: 0, borderLeft: "15px solid transparent", borderRight: "15px solid transparent", borderTop: "35px solid #EF4444", zIndex: 10, filter: "drop-shadow(0px 4px 5px rgba(0,0,0,0.5))" }} />
              <canvas ref={canvasRef} width={380} height={380} style={{ marginTop: 25, borderRadius: "50%", width: "100%", maxWidth: 380, height: "auto" }} />
            </div>

            <button
              onClick={runSpinAnimation}
              disabled={isSpinning || winnerIndex === -1}
              style={{ padding: "14px 24px", fontSize: 18, fontWeight: "bold", letterSpacing: 0, backgroundColor: isSpinning ? "#4b5563" : "#F59E0B", color: "#000000", border: "3px solid #78350F", borderRadius: 8, boxShadow: "0 6px 0 #78350F, 0 10px 20px rgba(0,0,0,0.4)", cursor: isSpinning ? "not-allowed" : "pointer", transform: isSpinning ? "translateY(4px)" : "none", transition: "all 0.1s ease", width: "100%" }}
            >
              {isSpinning ? "Spinning..." : "Draw Winner"}
            </button>
          </section>

          <section style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 24 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {Object.entries(modeDetails).map(([key, mode]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedMode(key)}
                  style={{ border: selectedMode === key ? "2px solid #2563eb" : "1px solid #d1d5db", background: selectedMode === key ? "#eff6ff" : "#fff", color: "#111827", borderRadius: 8, padding: "10px 14px", fontWeight: 700 }}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            <span style={{ display: "inline-block", background: "#dcfce7", color: "#166534", borderRadius: 6, padding: "5px 9px", fontWeight: 700, fontSize: 12 }}>{activeMode.badge}</span>
            <h2 style={{ margin: "12px 0 8px", color: "#111827" }}>{activeMode.title}</h2>
            <p style={{ color: "#4b5563", lineHeight: 1.6 }}>{activeMode.description}</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 22 }}>
              <Metric label="Funded" value={formatCurrency(fundedAmount)} />
              <Metric label="Participants" value={`${totalSlots}`} />
              <Metric label={activeMode.prizeLabel} value={selectedMode === "productLocked" ? "MacBook Pro" : formatCurrency(fundedAmount)} />
            </div>

            <div style={{ borderTop: "1px solid #e5e7eb", marginTop: 24, paddingTop: 18 }}>
              <h5 style={{ margin: "0 0 10px" }}>Winner checkout rule</h5>
              <p style={{ margin: 0, color: "#4b5563" }}>{activeMode.checkoutRule}</p>
              {winner && (
                <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: "#fef3c7", color: "#78350f", fontWeight: 700 }}>
                  Winner: {winner.label}. Redemption is ready for {selectedMode === "productLocked" ? "the selected product" : "marketplace checkout"}.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdvancedEqubWheel;
