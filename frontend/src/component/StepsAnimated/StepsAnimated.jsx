// StepsAnimated.jsx
import React, { useState, useEffect } from "react";
import "./StepsAnimated.css";

// images - update the import paths to your actual assets
import step1 from "../../assets/image/telegeram/promot.jpg";
import step2 from "../../assets/image/telegeram/on.jpg";
import step3 from "../../assets/image/telegeram/transfers.jpg";
import step4 from "../../assets/image/telegeram/changeowner.jpg";
import step6 from "../../assets/image/telegeram/2stp.jpg";
// import step48 from '../../assets/image/'
import { Link } from "react-router-dom";
// 
const STEPS = [
  { id: 1, label: "Open Member Options", text: "Click the member and choose the first option.", img: step1 },
  { id: 2, label: "Turn On Buttons", text: "Scroll to the bottom and turn ON the two red buttons.", img: step2 },
  { id: 3, label: "Transfer Owner", text: "After turning them ON, click 'Transfer Owner'.", img: step3 },
  { id: 4, label: "Change Owner", text: "On the next page click 'Change Owner'.", img: step4 },
  { id: 5, label: "Enter 2-Step Password", text: "Enter your Telegram 2-step password (never share it).", img: step6 },
];

export default function StepsAnimated() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0); // used to trigger re-animation

  useEffect(() => {
    // trigger an animation each time activeIndex changes
    setAnimKey((k) => k + 1);
  }, [activeIndex]);

  const goNext = () => setActiveIndex((i) => Math.min(i + 1, STEPS.length - 1));
  const goPrev = () => setActiveIndex((i) => Math.max(i - 1, 0));
  const selectStep = (idx) => setActiveIndex(idx);

  return (
    <div className="container steps-anim-wrapper py-4">
           <div className="top text-center m-5">
             <h1>How We Can sell On This Platform...............</h1>
                                 <h3>Follow This Steps To Sell </h3>
                            {/* <strong> <FaBoxOpen />First fill The Form from Ur dash baord Login'...'Kyc...Shop"..."Listings..Sell-SocialMedia-Account  </strong> */}
                            <ul>
                                 <li>Admin Aprove it..Automaticaliy  posted on It </li>
                             <li>If any one Buy this Group..After Paid U Must be Transfer The Group Owner  for That Buyer </li>
                              <li>Recive price to on ur  Bank account</li>

                            </ul> 
                              <div className="sellbutton  btn btn-lg btn-primary mt-4">
                                <Link to={'/Login'}>
                                    <button>Social-Media-Account</button>
                                    </Link>
                              </div>
             
        </div>
      <div className="row gx-4">

        {/* Left: timeline with arrows */}
        <div className="col-12 col-md-4 timeline-col pe-md-4">
         
          <div className="timeline-header d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">Steps</h5>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-outline-primary" onClick={goPrev} aria-label="Previous step" disabled={activeIndex === 0}>‹</button>
              <button className="btn btn-sm btn-outline-primary" onClick={goNext} aria-label="Next step" disabled={activeIndex === STEPS.length - 1}>›</button>
            </div>
          </div>

          <ul className="timeline-list list-unstyled mb-0">
            {STEPS.map((s, idx) => (
              <li key={s.id} className={`timeline-item ${idx === activeIndex ? "is-active" : ""}`} onClick={() => selectStep(idx)} role="button">
                <div className="timeline-left">
                  <div className="timeline-bullet">{idx + 1}</div>
                </div>

                <div className="timeline-main">
                  <div className="timeline-title">{s.label}</div>
                  <div className="timeline-sub">Step {idx + 1}</div>
                </div>

                {/* arrow between items */}
                <div className="timeline-arrow" aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: animated content */}
        <div className="col-12 col-md-8 content-col ps-md-4">
          <div key={animKey} className="content-panel animate-slide-fade">
            <h3 className="content-step-title">{STEPS[activeIndex].label}</h3>
            <p className="content-step-text">{STEPS[activeIndex].text}</p>

            <div className="image-frame">
              {/* responsive image handling */}
              <img
                src={STEPS[activeIndex].img}
                alt={STEPS[activeIndex].label}
                className="responsive-step-img"
                loading="lazy"
              />
            </div>

            <div className="mt-3 d-flex justify-content-between align-items-center">
              <small className="text-muted">Step {activeIndex + 1} of {STEPS.length}</small>
              <div>
                <button className="btn btn-sm btn-primary me-2" onClick={goPrev} disabled={activeIndex === 0}>Previous</button>
                <button className="btn btn-sm btn-primary" onClick={goNext} disabled={activeIndex === STEPS.length - 1}>Next</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
// StepsAnimated.css