import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container d-flex align-items-center justify-content-center text-center text-white px-3">
      <div>
        <h1 className="display-4 fw-bold">
          All you need to make money <br /> Sell What You Have On Your Hand
        </h1>

        <p className="lead mt-3">It’s free and takes less than a minute!</p>

        {/* Responsive Buttons */}
        <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-4">

          {/* Get Started */}
          <Link
            to="/register"
            className="btn btn-primary btn-lg px-4 py-2 w-100 w-md-auto"
          >
            Get Started
          </Link>

          {/* Browse All */}
          <Link
            to="/BrowseAllProducts"
            className="btn btn-primary btn-lg px-4 py-2 w-100 w-md-auto"
          >
            Browse All
          </Link>

          {/* Telegram Sell Group */}
          <Link
            to="/TelegeramLanding"
            className="btn btn-success btn-lg px-4 py-2 fw-semibold w-100 w-md-auto"
          >
            Sell  TG Group
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Home;
