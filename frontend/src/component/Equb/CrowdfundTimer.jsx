import { useEffect, useMemo, useState } from "react";

const formatCountdown = (msRemaining) => {
  if (msRemaining <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, total: totalSeconds };
};

export default function CrowdfundTimer({ expiresAt, compact = false }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeLeftMs = useMemo(() => {
    const expiryTime = new Date(expiresAt).getTime();
    return Math.max(0, expiryTime - now);
  }, [expiresAt, now]);

  const countdown = formatCountdown(timeLeftMs);
  const expired = timeLeftMs <= 0;

  if (!expiresAt) {
    return <span className="text-muted">No expiration</span>;
  }

  const pillStyle = {
    minWidth: compact ? "110px" : "140px",
    textAlign: "center",
    borderRadius: "999px",
    padding: compact ? "6px 10px" : "10px 14px",
    background: expired ? "#fee2e2" : "#ecfdf5",
    color: expired ? "#991b1b" : "#065f46",
    border: `1px solid ${expired ? "#fecaca" : "#a7f3d0"}`,
    fontWeight: 700,
    display: "inline-block",
  };

  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
      <div style={pillStyle}>
        {expired ? "Expired" : `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`}
      </div>
      {!compact && (
        <div className="text-muted small">
          {expired ? "Challenge ended" : `Ends in ${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`}
        </div>
      )}
    </div>
  );
}
