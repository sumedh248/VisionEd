import React from "react";
import "./Student.css";

function Student() {
  return (
    <div className="student">

      <h2 className="title">Dashboard</h2>

      {/* Top Cards */}
      <div className="cards">
        <div className="card">
          <i className="fas fa-brain icon"></i>
          <p>Aptitude Score</p>
          <h3>78%</h3>
        </div>

        <div className="card">
          <i className="fas fa-chart-line icon"></i>
          <p>Progress</p>
          <h3>65%</h3>
        </div>

        <div className="card">
          <i className="fas fa-briefcase icon"></i>
          <p>Careers</p>
          <h3>5</h3>
        </div>

        <div className="card">
          <i className="fas fa-book icon"></i>
          <p>Courses</p>
          <h3>3</h3>
        </div>
      </div>

      {/* Middle Sections */}
      <div className="sections">

        {/* Career Suggestions */}
        <div className="section">
          <h4><i className="fas fa-bullseye me-2"></i>Top Careers</h4>
          <ul>
            <li>Software Engineer</li>
            <li>Data Analyst</li>
            <li>UI/UX Designer</li>
          </ul>
        </div>

        {/* Colleges */}
        <div className="section">
          <h4><i className="fas fa-university me-2"></i>Colleges</h4>
          <ul>
            <li>IIT Bombay</li>
            <li>COEP Pune</li>
            <li>VIT Vellore</li>
          </ul>
        </div>

        {/* Skills */}
        <div className="section">
          <h4><i className="fas fa-lightbulb me-2"></i>Skills</h4>
          <ul>
            <li>JavaScript</li>
            <li>Problem Solving</li>
            <li>Communication</li>
          </ul>
        </div>

      </div>

      {/* Bottom Chart Section */}
      <div className="chart-section">
        <h4><i className="fas fa-chart-pie me-2"></i>Performance Overview</h4>

        <div className="chart-placeholder">
          📊 Chart will go here (use Chart.js later)
        </div>
      </div>

    </div>
  );
}

export default Student;