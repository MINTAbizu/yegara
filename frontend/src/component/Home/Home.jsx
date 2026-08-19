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
  { icon: <FaShieldAlt />, label: "Verified seller profiles" },
  { icon: <FaTruck />, label: "Digital and local commerce" },
  { icon: <FaUsers />, label: "Built around Ethiopian buyers" },
];

const marketPillars = [
  {
    icon: <FaStore />,
    title: "One shop, many product types",
    text: "Manage digital products, gifts, physical goods, books, and social accounts without jumping between tools.",
  },
  {
    icon: <FaLock />,
    title: "Trust before the first order",
    text: "Profiles, KYC steps, and clear product pages make it easier for buyers to know who they are dealing with.",
  },
  {
    icon: <FaBolt />,
    title: "Growth that is easy to track",
    text: "Referral bounty links, promotions, and seller dashboards keep the business side visible.",
  },
];

export default function Home() {
  return (
    <main className="home-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <div className="landing-hero__inner">
          <div className="landing-hero__copy">
            <p className="landing-hero__eyebrow">Yegara Marketplace</p>
            <h1 id="landing-title">A practical marketplace for Ethiopia's digital and local sellers.</h1>
            <p className="landing-hero__lead">
              Browse real listings, start a seller profile, promote products, or join crowdfunded buying with a cleaner flow from discovery to checkout.
            </p>

            <div className="landing-hero__actions" aria-label="Primary actions">
              <Link to="/BrowseAllProducts" className="landing-btn landing-btn--primary">
                Browse marketplace <FaArrowRight />
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
              <strong>Seller-ready</strong>
              <span>Publish products and manage orders from one place.</span>
            </div>
            <div className="market-snapshot market-snapshot--secure">
              <FaCheckCircle />
              <span>Profile and KYC flow</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-metrics" aria-label="Marketplace highlights">
        <div>
          <strong>Digital goods</strong>
          <span>Courses, templates, software, and downloads</span>
        </div>
        <div>
          <strong>Local products</strong>
          <span>Physical goods, gifts, and handmade items</span>
        </div>
        <div>
          <strong>Equb buying</strong>
          <span>Group-funded product opportunities</span>
        </div>
        <div>
          <strong>Referrals</strong>
          <span>Bounty links for measurable growth</span>
        </div>
      </section>

      <section className="market-pillars" aria-labelledby="market-pillars-title">
        <div className="section-heading">
          <p>Built for buyers and sellers</p>
          <h2 id="market-pillars-title">Less noise between listing, discovery, and trust</h2>
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
          <h2 id="landing-cta-title">Open a seller profile when you are ready.</h2>
          <p>Start by browsing the marketplace, then create an account to sell products, manage orders, or share a referral bounty link.</p>
        </div>
        <Link to="/register" className="landing-btn landing-btn--dark">
          Create Free Account
        </Link>
      </section>
    </main>
  );
}
