import React, { useState, useEffect } from "react";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/telegeram/የጋር2.png";
import "./Header.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const shopLinks = [
  { label: "Physical products", to: "/BrowseAllProducts" },
  { label: "Digital products", to: "/BrowseAllProducts" },
  { label: "Social accounts", to: "/Telegram" },
  { label: "Crowdfunding", to: "/crowdfunding" },
  { label: "Crowdfunding Billing", to: "/crowdfunding-billing" },
  { label: "Referral bounty", to: "/referral-bounty" },
  { label: "📍 Products_Near_You", to: "/BuyerProducts" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleShop = (e) => {
    e.stopPropagation();
    setShopOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUserProfile(null);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserProfile(res.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Error loading user profile:", err);
      }
      setUserProfile(null);
    }
  };

  useEffect(() => {
    fetchUserProfile();

    const handleProfileUpdated = () => fetchUserProfile();
    const handleWindowFocus = () => fetchUserProfile();

    window.addEventListener("profile-updated", handleProfileUpdated);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("profile-updated", handleProfileUpdated);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand" onClick={closeMenu}>
          <img src={logo} alt="Yegara Logo" />
          <span>DEBo</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link to="/BrowseAllProducts">Marketplace</Link>
          <Link to="/crowdfunding">Crowdfunding</Link>
          <Link to="/crowdfunding-billing">Crowdfunding Billing</Link>
          <Link to="/UpgradePro">Seller Tools</Link>
          <Link to="/BuyerProducts">📍 Products_Near_You</Link>
        </nav>

        {/* Desktop Header Actions & Mobile Toggle */}
        <div className="header-actions">
          {userProfile ? (
            <Link to="/userprofile" className="profile-header-link">
              <img
                src={userProfile.avatar || "https://via.placeholder.com/40"}
                alt={userProfile.user?.name || "Profile"}
                className="header-avatar"
              />
              <span className="profile-name">{userProfile.user?.name || "My Account"}</span>
            </Link>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="header-link">
                Sign in
              </Link>
              <Link to="/register" className="header-cta">
                Start selling
              </Link>
            </div>
          )}

          <button
            className="menu-icon"
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`drawer-backdrop ${menuOpen ? "active" : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Mobile Side Drawer Menu */}
      <aside className={`slide-menu ${menuOpen ? "active" : ""}`} aria-label="Mobile navigation">
        <div className="slide-header">
          <div className="brand brand--drawer">
            <img src={logo} alt="Yegara Logo" />
            <span>Yegara</span>
          </div>
          <button className="close-icon" onClick={closeMenu} aria-label="Close menu">
            <FaTimes size={18} />
          </button>
        </div>

        <ul className="drawer-links">
          <li>
            <Link to="/BrowseAllProducts" onClick={closeMenu}>
              Marketplace
            </Link>
          </li>
          <li>
            <Link to="/crowdfunding" onClick={closeMenu}>
              Crowdfunding
            </Link>
          </li>
          <li>
            <Link to="/crowdfunding-billing" onClick={closeMenu}>
              Crowdfunding Billing
            </Link>
          </li>
          <li>
            <button onClick={toggleShop} className="shop-parent" aria-expanded={shopOpen}>
              <span>Shop categories</span>
              <FaChevronDown className={`chevron-icon ${shopOpen ? "rotated" : ""}`} />
            </button>
            <ul className={`shop-submenu ${shopOpen ? "active" : ""}`}>
              {shopLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} onClick={closeMenu}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {userProfile ? (
            <li className="drawer-user-section">
              <Link to="/userprofile" onClick={closeMenu} className="drawer-user-link">
                <img
                  src={userProfile.avatar || "https://via.placeholder.com/30"}
                  alt=""
                  className="drawer-avatar"
                />
                <span>{userProfile.user?.name || "Your Account"}</span>
              </Link>
            </li>
          ) : (
            <li className="drawer-auth-section">
              <Link to="/login" className="drawer-link-signin" onClick={closeMenu}>
                Sign in
              </Link>
              <Link to="/register" className="drawer-cta" onClick={closeMenu}>
                Create account
              </Link>
            </li>
          )}
        </ul>
      </aside>
    </>
  );
};

export default Header;