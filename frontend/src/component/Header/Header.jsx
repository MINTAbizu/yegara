import React, { useState } from "react";
import { FaBars, FaChevronDown, FaTimes } from "react-icons/fa";
import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../../assets/telegeram/የጋር2.png";

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

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleShop = () => setShopOpen(!shopOpen);
  const closeMenu = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

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
        <Link to="/login" className="header-link">Sign in</Link>
        <Link to="/register" className="header-cta">Start selling</Link>
        <button
          className="menu-icon"
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

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
          <li><Link to="/userprofile" onClick={closeMenu}>Your account</Link></li>
          <li><Link to="/login" onClick={closeMenu}>Sign in</Link></li>
          <li><Link to="/register" className="drawer-cta" onClick={closeMenu}>Create account</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
