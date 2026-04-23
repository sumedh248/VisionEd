import React from "react";
import { useLocation } from "react-router-dom";
import "./CareerGuidance.css";

const CareerGuidance = () => {
  const location = useLocation();
  const { result, scores } = location.state || {};

  if (!result) {
    return (
      <div className="cg-page">
        <h2>No result found. Please take the test.</h2>
      </div>
    );
  }

  return (
    <div className="cg-page">

      {/* Header */}
      <div className="cg-header">
        <span className="cg-tag">AI Career Result</span>
        <h1>Your Career Recommendation</h1>
        <p>Based on your responses, here’s the best path for you.</p>
      </div>

      {/* Career Card */}
      <div className="cg-card highlight">
        <h2>{result.career}</h2>
        <p className="cg-category">{result.category}</p>
      </div>

      {/* Scores */}
      <div className="cg-card">
        <h3>📊 Your Scores</h3>
        <div className="cg-scores">
          {Object.entries(scores).map(([key, val]) => (
            <div key={key} className="cg-score-item">
              <span>{key}</span>
              <strong>{val.toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="cg-card">
        <h3>🧠 Skills Required</h3>
        <ul>
          {result.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Colleges */}
      <div className="cg-card">
        <h3>🏫 Recommended Colleges</h3>
        <ul>
          {result.colleges.map((college, i) => (
            <li key={i}>{college}</li>
          ))}
        </ul>
      </div>

      {/* Roadmap */}
      <div className="cg-card">
        <h3>🚀 Roadmap</h3>
        <ol>
          {result.roadmap.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

    </div>
  );
};

export default CareerGuidance;