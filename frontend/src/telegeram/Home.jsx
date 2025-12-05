import React from "react";
import tradeTgImage from "../assets/image/telegeram.jpg";
import { Link } from "react-router-dom";
import TelegramPrice from "./TelegramPrice ";
function HomePage() {
  return (
   <>
    <div className="container text-center py-5">
      {/* Title */}
      <h1 className="fw-bold mb-3">WELCOME TO Trade-TG</h1>

      {/* Small Image */}
      <div className="mb-4">
        <img
          src={tradeTgImage}
          alt="Trade TG"
          className="img-fluid"
          style={{ maxWidth: "180px" }}
        />
      </div>

      {/* Sell Telegram Group Button */}
      <div className="d-flex  justify-content-center gap-3">
        <Link to={"/Telegram"}>  <button className="btn btn-success px-4 py-2 fw-semibold rounded-3">
        Sell Telegram Group
      </button>
      </Link>
        <Link to={"/HowToSell"}> 
         <button className="btn btn-success px-4 py-2 fw-semibold rounded-3">
        How We can sell
      </button></Link>
      </div>
    </div>
    < TelegramPrice/>
   </>
   
  );
}

export default HomePage;
