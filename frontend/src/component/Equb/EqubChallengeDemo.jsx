import CrowdfundTimer from "./CrowdfundTimer";
import EqubSlotProgress from "./EqubSlotProgress";

export default function EqubChallengeDemo() {
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000 + 34 * 1000).toISOString();

  return (
    <div style={{ maxWidth: 620, margin: "40px auto", padding: 24, borderRadius: 18, background: "#f8fafc", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ color: "#64748b", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.2 }}>
            Hourly Equb Challenge
          </div>
          <h3 style={{ margin: "8px 0 0" }}>Premium Laptop Crowdfunding</h3>
        </div>
        <div style={{ background: "#111827", color: "#fff", borderRadius: 12, padding: "8px 14px", fontWeight: 700 }}>
          40,000 Birr total
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <CrowdfundTimer expiresAt={expiresAt} />
      </div>

      <EqubSlotProgress filledSlots={34} totalSlots={40} />

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22, color: "#475569", fontSize: 14 }}>
        <span>Ticket Price</span>
        <strong>1,000 Birr</strong>
      </div>

      <button
        type="button"
        style={{
          width: "100%",
          marginTop: 22,
          border: "none",
          borderRadius: 12,
          background: "linear-gradient(90deg, #2563eb 0%, #10b981 100%)",
          color: "#fff",
          fontWeight: 700,
          padding: "14px 18px",
          cursor: "pointer",
        }}
      >
        Join Challenge
      </button>
    </div>
  );
}
