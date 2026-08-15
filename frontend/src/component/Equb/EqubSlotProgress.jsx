export default function EqubSlotProgress({ filledSlots = 0, totalSlots = 1 }) {
  const safeTotal = Math.max(1, Number(totalSlots) || 1);
  const safeFilled = Math.min(Math.max(Number(filledSlots) || 0, 0), safeTotal);
  const percent = (safeFilled / safeTotal) * 100;

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
          fontWeight: 600,
        }}
      >
        <span>Slots filled</span>
        <span>
          {safeFilled} / {safeTotal}
        </span>
      </div>

      <div
        style={{
          width: "100%",
          background: "#e5e7eb",
          borderRadius: 999,
          overflow: "hidden",
          height: 14,
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            background: "linear-gradient(90deg, #10b981 0%, #3b82f6 100%)",
            height: "100%",
            borderRadius: 999,
            transition: "width 0.35s ease",
          }}
        />
      </div>
    </div>
  );
}
