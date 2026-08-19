import React, { useState, useEffect } from "react";
import { FaBars, FaChevronDown, FaTimes, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/telegeram/የጋር2.png";
import "./Header.css";

const API_URL = import.meta.env.VITE_API_URL;

const shopLinks = [
  { label: "Physical products", to: "/BrowseAllProducts" },
  { label: "Digital products", to: "/BrowseAllProducts" },
  { label: "Social accounts", to: "/Telegram" },
  { label: "Crowdfunding", to: "/crowdfunding" },
  { label: "Referral bounty", to: "/referral-bounty" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleShop = () => setShopOpen(!shopOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token"); // Assuming auth token is saved in localStorage
      if (!token) return;

      try {
        const res = await axios.get(`${API_URL}/api/profile/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserProfile(res.data);
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <header className="site-header">
      <Link to="/" className="brand" onClick={closeMenu}>
        <img src={logo} alt="Yegara" />
        <span>DEBo </span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link to="/BrowseAllProducts">Marketplace</Link>
        <Link to="/crowdfunding">Crowdfunding</Link>
        <Link to="/Crowdfunding">Crowdfunding Bill</Link>
        <Link to="/UpgradePro">Seller Tools</Link>
      </nav>

      <div className="header-actions">
        {userProfile ? (
          /* Profile view when user is signed up/has profile */
          <Link to="/userprofile" className="profile-header-link">
            <img
              src={userProfile.avatar || "https://via.placeholder.com/40"}
              alt={userProfile.user?.name || "Profile"}
              className="header-avatar"
            />
            <span className="profile-name">{userProfile.user?.name || "My Account"}</span>
          </Link>
        ) : (
          /* Default auth actions */
          <>
            <Link to="/login" className="header-link">
              Sign in
            </Link>
            <Link to="/register" className="header-cta">
              Start selling
            </Link>
          </>
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

      {/* Mobile Drawer Menu */}
      <nav className={`slide-menu ${menuOpen ? "active" : ""}`} aria-label="Mobile navigation">
        <div className="slide-header">
          <div className="brand brand--drawer">
            <img src={logo} alt="" />
            <span>Yegara</span>
          </div>
          <button className="close-icon" onClick={toggleMenu} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>
        <ul>
          <li><Link to="/BrowseAllProducts" onClick={closeMenu}>Marketplace</Link></li>
          <li><Link to="/crowdfunding" onClick={closeMenu}>Equb crowdfunding</Link></li>
          <li>
            <button onClick={toggleShop} className="shop-parent" aria-expanded={shopOpen}>
              Shop categories <FaChevronDown />
            </button>
            <ul className={`shop-submenu ${shopOpen ? "active" : ""}`}>
              {shopLinks.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} onClick={closeMenu}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </li>

          {userProfile ? (
            <li>
              <Link to="/userprofile" onClick={closeMenu} className="drawer-user-link">
                <img
                  src={userProfile.avatar || "https://via.placeholder.com/30"}
                  alt=""
                  style={{ width: 24, height: 24, borderRadius: "50%", marginRight: 8 }}
                />
                {userProfile.user?.name || "Your Account"}
              </Link>
            </li>
          ) : (
            <>
              <li><Link to="/login" onClick={closeMenu}>Sign in</Link></li>
              <li><Link to="/register" className="drawer-cta" onClick={closeMenu}>Create account</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;