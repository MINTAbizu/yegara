import React from "react";
import { Link } from "react-router-dom";

export default function TopSection() {
  return (
    <>
      <div className="top-wrapper">

        {/* PROMO BAR */}
        <div className="promo-bar">
          🎉 New sellers pay 0% commission this month — Join today!
        </div>

        {/* TRUST STRIP */}
        <div className="trust-strip">
          <span>✔ Verified sellers</span>
          <span>🔒 Secure transactions</span>
          <span>⚡ Instant digital delivery</span>
        </div>

        {/* MARKETPLACE STATS */}
        <div className="stats-strip">
          <div>
            <strong>12K+</strong>
            <p>Products</p>
          </div>

          <div>
            <strong>5K+</strong>
            <p>Sellers</p>
          </div>

          <div>
            <strong>50K+</strong>
            <p>Transactions</p>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-actions">
          <Link to="/register" className="action primary">
            Sell Product
          </Link>

          <Link to="/BrowseAllProducts" className="action">
            Browse Marketplace
          </Link>

          <Link to="/TelegeramLanding" className="action success">
            Sell via Telegram
          </Link>
        </div>

      </div>

      {/* STYLES */}
      <style>{`

        .top-wrapper {
          font-family: system-ui;
        }

        /* PROMO */

        .promo-bar {
          background: #111;
          color: #fff;
          text-align: center;
          padding: 8px 12px;
          font-size: 14px;
        }

        /* TRUST */

        .trust-strip {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          background: #0ea5e9;
          color: white;
          padding: 10px;
          font-size: 14px;
        }

        /* STATS */

        .stats-strip {
          display: flex;
          justify-content: center;
          gap: 40px;
          padding: 20px;
          background: #f5f5f5;
          text-align: center;
        }

        .stats-strip strong {
          font-size: 22px;
        }

        .stats-strip p {
          margin: 4px 0 0;
          font-size: 13px;
          opacity: 0.7;
        }

        /* ACTIONS */

        .quick-actions {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding: 20px;
          flex-wrap: wrap;
          background: white;
        }

        .action {
          padding: 10px 18px;
          border-radius: 8px;
          text-decoration: none;
          border: 2px solid #0ea5e9;
          color: #0ea5e9;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .action:hover {
          transform: translateY(-2px);
        }

        .primary {
          background: #0ea5e9;
          color: white;
        }

        .success {
          border-color: #22c55e;
          color: #22c55e;
        }

        /* MOBILE */

        @media (max-width: 600px) {

          .stats-strip {
            flex-direction: column;
            gap: 12px;
          }

        }

      `}</style>
    </>
  );
}