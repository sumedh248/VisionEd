import React from "react";
import "./TestResult.css";

function TestResult() {
  const score = 8;
  const total = 10;

  return (
    <div className="result-container">

      <h2 className="title">Test Result</h2>

      {/* Score Card */}
      <div className="result-card">
        <h3>Your Score</h3>
        <p className="score">{score} / {total}</p>
      </div>

      {/* Performance */}
      <div className="result-details">
        <div className="detail">
          <i className="fas fa-check-circle text-success"></i>
          <p>Correct Answers: {score}</p>
        </div>

        <div className="detail">
          <i className="fas fa-times-circle text-danger"></i>
          <p>Wrong Answers: {total - score}</p>
        </div>
      </div>

      {/* Feedback */}
      <div className="feedback">
        {score > 7 ? "Great job! 🎉" : "Keep practicing 👍"}
      </div>

      <div className="action-buttons">

        <button
          className="btn btn-success"
          onClick={() => window.location.href = "/career"}
        >
          <i className="fas fa-compass me-2"></i>
          Career Guidance by VE
        </button>

      </div>


    </div>
  );
}

export default TestResult;