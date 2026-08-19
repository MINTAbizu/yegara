import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../../assets/telegeram/የጋር2.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleShop = () => setShopOpen(!shopOpen);

  return (
    <header className="header d-flex justify-content-between align-items-center p-3">
      {/* Logo */}
      <div className="logo" >
        <img src={logo}  style={{width:"50px",  height:"35px", overflow:"hidden", justifyContent:"center" ,alignItems:"center"}} alt="Logo" className="img-fluid" />
      </div>

      <nav className="top-nav" aria-label="Primary navigation">
        <Link to="/" className="top-nav-link">Home</Link>
        <Link to="/BrowseAllProducts" className="top-nav-link">Marketplace</Link>
        <Link to="/books" className="top-nav-link">Books</Link>
        <Link to="/crowdfunding" className="top-nav-link top-nav-link--highlight">Crowdfunding</Link>
      </nav>

      {/* Menu Icon (always visible) */}
      <div className="menu-icon" onClick={toggleMenu}>
        {menuOpen ? <FaTimes size={25} /> : <FaBars size={25} />}
      </div>

      {/* Slide-in Menu */}
      <nav className={`slide-menu ${menuOpen ? "active" : ""}`}>
        <div className="slide-header">
          {/* <img src={logo} alt="Logo" className="slide-logo" /> */}
          <FaTimes className="close-icon" onClick={toggleMenu} />
        </div>
        <ul className="list-unstyled">
          <li>Freelancer</li>
          <li>Club</li>
          <Link to="/crowdfunding" onClick={toggleMenu}><li>Crowdfunding</li></Link>

          {/* Shop with Submenu */}
          <li onClick={toggleShop} className="shop-parent">
            Shop
            <ul className={`shop-submenu ${shopOpen ? "active" : ""}`}>
              {/* <li>💰 Earn</li> */}
              <li>📦 Physical Products</li>
              <li>💻 Digital Products</li>
              <li>💻 Social Media Account</li>
              <li>🧑‍ Freelancer</li>
              <li>🤝 Affiliate</li>
            </ul>
          </li>

          <li>Your Account</li>
          <li>Sign in</li>
          <Link to="/books" onClick={toggleMenu}><li>Books</li></Link>
          <Link to={'/register'} onClick={toggleMenu}>  <li>Sign up for free</li></Link>
         
        </ul>
      </nav>
    </header>
  );
};

export default Header;
