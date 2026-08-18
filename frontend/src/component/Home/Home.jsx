import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBolt,
  FaCheckCircle,
  FaGift,
  FaLock,
  FaMobileAlt,
  FaShieldAlt,
  FaStore,
  FaTruck,
  FaUsers,
} from "react-icons/fa";
import heroImage from "../../assets/image/Promoting Handmade Crafts Online.png";
import "./Home.css";

const trustItems = [
  { icon: <FaShieldAlt />, label: "Protected checkout" },
  { icon: <FaTruck />, label: "Digital and local delivery" },
  { icon: <FaUsers />, label: "Verified community sellers" },
];

const marketPillars = [
  {
    icon: <FaStore />,
    title: "Sell anything faster",
    text: "List digital products, gifts, physical items, and social accounts from one dashboard.",
  },
  {
    icon: <FaLock />,
    title: "Build buyer trust",
    text: "KYC, profiles, and order tracking help serious sellers stand out on the platform.",
  },
  {
    icon: <FaBolt />,
    title: "Grow with rewards",
    text: "Referral bounty links and product promotion paths help users bring more people in.",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero__inner">
          <div className="landing-hero__copy">
            <p className="landing-hero__eyebrow">Yegara Marketplace</p>
            <h1 id="landing-title">Buy, sell, and grow in one trusted Ethiopian marketplace.</h1>
            <p className="landing-hero__lead">
              Discover digital goods, gift products, physical items, crowdfunding opportunities, and seller tools built for everyday commerce.
            </p>

            <div className="landing-hero__actions" aria-label="Primary actions">
              <Link to="/BrowseAllProducts" className="landing-btn landing-btn--primary">
                Browse Products <FaArrowRight />
              </Link>
              <Link to="/register" className="landing-btn landing-btn--secondary">
                Start Selling
              </Link>
            </div>

            <div className="landing-hero__trust" aria-label="Marketplace trust features">
              {trustItems.map((item) => (
                <span key={item.label}>
                  {item.icon}
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="landing-hero__visual" aria-label="Yegara marketplace preview">
            <img src={heroImage} alt="Handmade products promoted online" />
            <div className="market-snapshot market-snapshot--sales">
              <strong>Fast setup</strong>
              <span>Create your shop and publish products.</span>
            </div>
            <div className="market-snapshot market-snapshot--secure">
              <FaCheckCircle />
              <span>Verified seller flow</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-metrics" aria-label="Marketplace highlights">
        <div>
          <strong>Digital</strong>
          <span>Downloads and online products</span>
        </div>
        <div>
          <strong>Physical</strong>
          <span>Local products and delivery</span>
        </div>
        <div>
          <strong>Equb</strong>
          <span>Crowdfunded buying experiences</span>
        </div>
        <div>
          <strong>Bounty</strong>
          <span>Referral growth for every user</span>
        </div>
      </section>

      <section className="market-pillars" aria-labelledby="market-pillars-title">
        <div className="section-heading">
          <p>Built for buyers and sellers</p>
          <h2 id="market-pillars-title">A cleaner way to run marketplace activity</h2>
        </div>
        <div className="market-pillars__grid">
          {marketPillars.map((item) => (
            <article className="market-pillar" key={item.title}>
              <div className="market-pillar__icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta" aria-labelledby="landing-cta-title">
        <div>
          <FaMobileAlt />
          <h2 id="landing-cta-title">Ready to explore Yegara?</h2>
          <p>Start with the marketplace, then create an account when you are ready to buy, sell, or share your bounty link.</p>
        </div>
        <Link to="/register" className="landing-btn landing-btn--dark">
          Create Free Account
        </Link>
      </section>
    </main>
  );
}
