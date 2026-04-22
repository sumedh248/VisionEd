import React from "react";
import Homeimg from "../../assets/home.jpeg";
import "./hero.css";

export default function Hero() {
  return (
    <div>
      <div
        style={{
          height: "100vh",
          overflow: "visible",
          backgroundImage: `url(${Homeimg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="text-white d-flex align-items-center position-relative"
      >
        <div className="hero-content ms-5 fade-in">
          <h1 className="display-3 fw-bold">From Dreams to Direction</h1>
          <h2 className="fs-3">VisionEd Guides You</h2>
          <p>
            Personalized Career Guidance for Every Student, Powered by AI.
            <br /> Let's Start with test and know where you get fitt!!
          </p>
          <button
            className="btn text-white card-hover"
            style={{ backgroundColor: "green" }}
          >
            Get Strated Now→
          </button>
        </div>
      </div>

      {/* Content Box - Overlapping Hero Section */}
      <div
        className="container position-relative pb-5"
        style={{ marginTop: "-100px", zIndex: 10 }}
      >
        <div className="bg-white rounded shadow-lg p-5 mx-3">
          <div className="row">
            <div className="col-md-4 text-center swipe-right card-hover">
              <div className="mb-3">
                <i
                  className="fas fa-graduation-cap fs-1 "
                  style={{ color: "green" }}
                ></i>
              </div>
              <h5 className="fw-bold">Career Path</h5>
              <p className="text-muted small">
                Global University has established its recognition
              </p>
            </div>
            <div className="col-md-4 text-center swipe-right card-hover">
              <div className="mb-3">
                <i
                  className="fas fa-university fs-1 "
                  style={{ color: "green" }}
                ></i>
              </div>
              <h5 className="fw-bold">Best Colleges</h5>
              <p className="text-muted small">
                Global University was established
              </p>
            </div>
            <div className="col-md-4 text-center swipe-right card-hover">
              <div className="mb-3">
                <i
                  class="fa-solid fa-laptop-code fs-1 "
                  style={{ color: "green" }}
                ></i>
              </div>
              <h5 className="fw-bold">Ai-Powered</h5>
              <p className="text-muted small">
                Global University has established
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
