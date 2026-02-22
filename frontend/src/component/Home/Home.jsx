import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaStar, FaTruck, FaGift, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <main className="home">

        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <h1>
              Ethiopia’s Modern Marketplace for
              <span> Digital & Physical Products</span>
            </h1>
            <p>Buy securely. Sell instantly. Connect with trusted sellers.</p>
            <div className="hero-buttons">
              <Link to="/register" className="btn primary">
                Start Selling
              </Link>
              <Link to="/BrowseAllProducts" className="btn outline">
                Browse Marketplace
              </Link>
            </div>
            <div className="hero-icons">
              <div><FaShieldAlt /> Secure Transactions</div>
              <div><FaTruck /> Fast Delivery</div>
              <div><FaGift /> Gift Ready Products</div>
            </div>
          </div>
        </section>

        {/* FEATURED PREVIEW */}
        {/* <section className="section center">
          <h2>Trending Products</h2>
          <div className="grid">
            {[1,2,3,4].map((item)=>(
              <article key={item} className="card">
                <div className="image"></div>
                <h4>Product Title {item}</h4>
                <p>Digital / Physical</p>
                <div className="card-bottom">
                  <div className="rating">
                    <FaStar color="#facc15" /><FaStar color="#facc15" /><FaStar color="#facc15" /><FaStar color="#facc15" /><FaStar color="#ddd" />
                    <span>(25)</span>
                  </div>
                  <button className="btn small">View Product</button>
                </div>
              </article>
            ))}
          </div>
        </section> */}

        {/* STATS / TRUST */}
        <section className="section dark stats">
          <h2>Why Buyers & Sellers Trust Us</h2>
          <div className="grid trust">
            <div><FaCheckCircle /> Verified Sellers</div>
            <div><FaShieldAlt /> Secure Transactions</div>
            <div><FaTruck /> Instant Delivery</div>
            <div><FaUsers /> Local Community</div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        {/* <section className="section center">
          <h2>How It Works</h2>
          <div className="steps">
            <div className="step-card">
              <h3>1</h3>
              <FaUsers size={32} />
              <p>Create an account</p>
            </div>
            <div className="step-card">
              <h3>2</h3>
              <FaGift size={32} />
              <p>Browse or list products</p>
            </div>
            <div className="step-card">
              <h3>3</h3>
              <FaTruck size={32} />
              <p>Buy or sell securely</p>
            </div>
          </div>
        </section> */}

        {/* CTA */}
        <section className="cta">
          <h2>Start Your Marketplace Journey Today</h2>
          <Link to="/register" className="btn primary">Create Free Account</Link>
        </section>

      </main>

      {/* STYLES */}
      <style>{`
        .home {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.5;
        }
        h1,h2,h3,h4 { margin:0 0 12px; }
        section { padding: 80px 20px; }
        .center { text-align:center; }

        /* HERO */
        .hero {
          min-height: 90vh;
          display:flex; align-items:center; justify-content:center;
          text-align:center; color:white;
          background: linear-gradient(135deg,#0f172a,#1e293b);
          position:relative;
        }
        .hero span { color:#38bdf8; }
        .hero-buttons { margin-top:24px; display:flex; gap:16px; justify-content:center; flex-wrap:wrap; }
        .hero-icons { display:flex; gap:20px; justify-content:center; margin-top:30px; font-size:14px; }
        .hero-icons div { display:flex; align-items:center; gap:6px; }

        /* BUTTONS */
        .btn { border:none; cursor:pointer; padding:12px 22px; border-radius:8px; font-weight:600; text-decoration:none; transition:all .2s ease; }
        .btn:hover { transform:translateY(-2px); opacity:.9; }
        .primary { background:#0ea5e9; color:white; }
        .outline { border:2px solid white; color:white; background:transparent; }
        .small { padding:8px 14px; font-size:14px; }

        /* GRID CARDS */
        .grid { display:grid; gap:20px; margin-top:32px; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); }
        .card { background:#fff; padding:16px; border-radius:12px; transition:all .3s ease; box-shadow:0 4px 20px rgba(0,0,0,0.08); }
        .card:hover { transform:translateY(-5px); box-shadow:0 8px 28px rgba(0,0,0,0.12); }
        .image { height:150px; background:#ddd; border-radius:8px; margin-bottom:12px; }
        .card-bottom { display:flex; justify-content:space-between; align-items:center; margin-top:8px; }
        .rating { display:flex; align-items:center; gap:4px; font-size:12px; }

        /* TRUST / STATS */
        .dark { background:#111; color:white; }
        .trust div { background:#1f1f1f; padding:20px; border-radius:10px; text-align:center; display:flex; justify-content:center; align-items:center; gap:8px; }

        /* STEPS */
        .steps { display:flex; gap:40px; justify-content:center; flex-wrap:wrap; margin-top:32px; }
        .step-card { max-width:200px; background:#f5f5f5; padding:20px; border-radius:12px; display:flex; flex-direction:column; align-items:center; gap:8px; transition:all .3s ease; }
        .step-card:hover { transform:translateY(-5px); box-shadow:0 8px 20px rgba(0,0,0,0.1); }

        /* CTA */
        .cta { background:#0ea5e9; text-align:center; color:white; padding:80px 20px; }

        /* RESPONSIVE */
        @media (max-width:600px){
          section { padding:60px 16px; }
          .steps { gap:20px; }
          .hero-icons { flex-direction:column; gap:12px; }
        }
      `}</style>
    </>
  );
}