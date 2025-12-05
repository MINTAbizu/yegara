import React from "react";
import tradeTgImage from "../assets/image/telegeram.jpg";
function Header() {
  return (
    <header className="container-fluid py-3 border-bottom bg-white">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo */}
        <div className="d-flex align-items-center">
          <img
            src={tradeTgImage}
            alt="Logo"
            className="img-fluid"
            style={{ width: "70px", maxWidth: "40vw" }}
          />
        </div>

        {/* Login Button */}
        <button className="btn btn-primary px-4 py-2 fw-semibold rounded-3">
          Login
        </button>
      </div>
    </header>
  );
}

export default Header;
