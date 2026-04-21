import React from "react";
import "./CareerGuidance.css";
import hero from "../../assets/signup.jpeg"; // you can change image

function CareerGuidance() {
  return (
    <div className="career">

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h2>Career Guidance by VisionEd</h2>
          <p>
            Get personalized career recommendations, skills roadmap,
            and top college suggestions based on your performance.
          </p>

          <button className="btn btn-success">
            <i className="fas fa-compass me-2"></i>
            Explore Careers
          </button>
        </div>

        <div className="hero-img">
          <img src={hero} alt="career" />
        </div>
      </div>

      {/* 2 Column Layout */}
      <div className="grid">

        <div className="card">
          <h4><i className="fas fa-bullseye me-2"></i>Recommended Career</h4>
          <p style={{backgroundColor:'lightgreen', borderRadius:"80px"}}>Software Engineer</p>
        </div>

        <div className="card">
          <h4><i className="fas fa-lightbulb me-2"></i>Skills Required</h4>
          <ul>
            <li>Programming</li>
            <li>Problem Solving</li>
            <li>Communication</li>
          </ul>
        </div>

        <div className="card">
          <h4><i className="fas fa-university me-2"></i>Top Colleges</h4>
          <ul>
            <li>IIT Bombay</li>
            <li>NIT Trichy</li>
          </ul>
        </div>

        <div className="card">
          <h4><i className="fas fa-road me-2"></i>Career Roadmap</h4>
          <ol>
            <li>12th Science</li>
            <li>Entrance Exams</li>
            <li>Engineering</li>
          </ol>
        </div>

      </div>

      {/* Actions */}
      <div className="actions">
        <button className="btn btn-outline-success">
          <i className="fas fa-book me-2"></i>Courses
        </button>

        <button className="btn btn-success">
          <i className="fas fa-user-tie me-2"></i>Mentor
        </button>
      </div>

    </div>
  );
}

export default CareerGuidance;