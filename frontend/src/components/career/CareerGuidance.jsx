import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./CareerGuidance.css";
import hero from "../../assets/signup.jpeg"; // you can change image
import RoadmapFlow from "./RoadmapFlow";

function CareerGuidance() {
  const location = useLocation();
  const result = location.state?.result || [];
  const scores = location.state?.scores || {};
  const topCareer = result[0];
  const [roadmap, setRoadmap] = useState(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState("");

  console.log(result);

  const getRoadmap = async (career) => {
    setLoadingRoadmap(true);
    setRoadmapError("");

    try {
      const res = await fetch("http://localhost:3000/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          career,
          strengths: scores
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Roadmap generation failed");
      }

      setRoadmap(data);
    } catch (error) {
      setRoadmapError(error.message);
    } finally {
      setLoadingRoadmap(false);
    }
  };

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
          {topCareer ? (
            <div className="career-results">
              <p className="top-career">
                {topCareer.career}
                <span>{topCareer.match}% match</span>
              </p>

              {result.slice(1).map((career) => (
                <div className="career-match" key={career.career}>
                  <span>{career.career}</span>
                  <strong>{career.match}%</strong>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-result">Complete the quiz to see your career matches.</p>
          )}
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
          {topCareer ? (
            <>
              <button
                className="btn btn-success roadmap-btn"
                onClick={() => getRoadmap(topCareer.career)}
                disabled={loadingRoadmap}
              >
                {loadingRoadmap ? "Generating roadmap..." : "Generate Roadmap"}
              </button>

              {roadmapError && <p className="roadmap-error">{roadmapError}</p>}

              {roadmap?.steps?.length > 0 && (
                <RoadmapFlow steps={roadmap.steps} />
              )}
            </>
          ) : (
            <p className="empty-result">Complete the quiz to generate a roadmap.</p>
          )}
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
