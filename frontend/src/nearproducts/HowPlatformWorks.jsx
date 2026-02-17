import React from "react";
import { FaUserPlus, FaMapMarkerAlt, FaStore, FaShoppingCart, FaShieldAlt } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus size={32} />,
    title: "Create Account",
    desc: "Sign up quickly and securely to access marketplace features for buying and selling.",
  },
  {
    icon: <FaMapMarkerAlt size={32} />,
    title: "Auto Location Detection",
    desc: "Your location is detected to connect you with nearby trusted sellers and products.",
  },
  {
    icon: <FaStore size={32} />,
    title: "Post or Browse Products",
    desc: "Sellers upload products. Buyers discover items available close to them.",
  },
  {
    icon: <FaShoppingCart size={32} />,
    title: "Buy with Confidence",
    desc: "Secure transactions with transparent pricing and verified sellers.",
  },
  {
    icon: <FaShieldAlt size={32} />,
    title: "Trusted Marketplace",
    desc: "KYC verification ensures safe interactions for all users.",
  },
];

const HowPlatformWorks = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center mb-4 fw-bold">
        How Our Marketplace Works
      </h2>

      <p className="text-center text-muted mb-5">
        Discover, connect, and trade with nearby verified users — fast, safe, and simple.
      </p>

      <div className="row g-4">
        {steps.map((step, index) => (
          <div key={index} className="col-md-6 col-lg-4">
            <div className="work-card h-100 text-center p-4 shadow-sm">
              <div className="icon-wrapper mb-3">{step.icon}</div>
              <h5 className="fw-semibold">{step.title}</h5>
              <p className="text-muted">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-5">
        <button className="btn btn-primary px-4 me-3">
          Start Buying
        </button>
        <button className="btn btn-outline-success px-4">
          Post Product
        </button>
      </div>

      {/* Styles */}
      <style>{`
        .work-card {
          border-radius: 14px;
          background: #fff;
          transition: all 0.25s ease;
          cursor: pointer;
        }

        .work-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .icon-wrapper {
          width: 60px;
          height: 60px;
          margin: auto;
          border-radius: 50%;
          background: linear-gradient(135deg, #007bff, #00c6ff);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default HowPlatformWorks;
