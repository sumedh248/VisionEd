import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import RoadmapFlow from "./RoadmapFlow";
import { API_BASE_URL } from "../../utils/api";
import "./CareerGuidance.css";

const CareerGuidance = () => {
  const location = useLocation();
  const { result: routedResult, scores: routedScores, saveStatus: routedSaveStatus } = location.state || {};
  const [savedResult, setSavedResult] = useState(null);
  const [savedScores, setSavedScores] = useState({});
  const [fetchStatus, setFetchStatus] = useState("");
  const [isLoading, setIsLoading] = useState(!routedResult);

  useEffect(() => {
    if (routedResult) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const fetchLatestSavedResult = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) {
          throw new Error("Please login first");
        }

        const response = await fetch(`${API_BASE_URL}/test-results/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to load saved results");
        }

        const latest = Array.isArray(data.results) ? data.results[0] : null;

        if (!latest) {
          if (isMounted) {
            setFetchStatus("No saved result found. Please take the test first.");
          }
          return;
        }

        if (isMounted) {
          setSavedResult(latest);
          setSavedScores(latest.scores && typeof latest.scores === "object" ? latest.scores : {});
          setFetchStatus("Showing your latest saved result from database.");
        }
      } catch (err) {
        if (isMounted) {
          setFetchStatus(err.message || "Could not fetch saved results.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchLatestSavedResult();

    return () => {
      isMounted = false;
    };
  }, [routedResult]);

  const result = routedResult || savedResult;
  const scores = routedResult
    ? routedScores && typeof routedScores === "object"
      ? routedScores
      : {}
    : savedScores;
  const saveStatus = routedSaveStatus || fetchStatus;

  const safeScores = scores && typeof scores === "object" ? scores : {};
  const safeSkills = Array.isArray(result?.skills) ? result.skills : [];
  const safeColleges = Array.isArray(result?.colleges) ? result.colleges : [];
  const safeRoadmap = Array.isArray(result?.roadmap) ? result.roadmap : [];
  const safeRoadmapSteps = Array.isArray(result?.roadmapSteps) ? result.roadmapSteps : [];
  const safeMlPredictions = Array.isArray(result?.mlPredictions) ? result.mlPredictions : [];
  const safeSources = result?.sources && typeof result.sources === "object" ? result.sources : {};
  const roadmapStepsForFlow = safeRoadmapSteps.length
    ? safeRoadmapSteps
    : safeRoadmap.map((step) => {
        const text = String(step || "").trim();
        const [titlePart, ...descriptionParts] = text.split(":");

        return {
          title: titlePart?.trim() || "Roadmap Step",
          description: descriptionParts.join(":").trim(),
        };
      });

  if (isLoading) {
    return (
      <div className="cg-page">
        <h2>Loading saved result...</h2>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="cg-page">
        <h2>No result found. Please take the test.</h2>
        {saveStatus && <p>{saveStatus}</p>}
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
        {saveStatus && <p>{saveStatus}</p>}
        <div style={{ marginTop: "1rem" }}>
          <Link to="/quiz" className="cg-action-link" style={{ display: "inline-block", padding: "10px 20px", background: "#0e9f8a", color: "#fff", textDecoration: "none", borderRadius: "8px", fontWeight: "600", fontSize: "14px" }}>
            Take Another Test
          </Link>
        </div>
      </div>

      {/* Career Card */}
      <div className="cg-card highlight">
        <h2>{result.career}</h2>
        <p className="cg-category">{result.category}</p>
      </div>

      {/* Scores */}
      <div className="cg-card">
        <h3> Your Scores</h3>
        <div className="cg-scores">
          {Object.entries(safeScores).map(([key, val]) => (
            <div key={key} className="cg-score-item">
              <span>{key}</span>
              <strong>{Number(val).toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="cg-card">
        <h3> Skills Required</h3>
        <ul>
          {safeSkills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Colleges */}
      <div className="cg-card">
        <h3> Recommended Colleges</h3>
        <ul>
          {safeColleges.map((college, i) => (
            <li key={i}>{college}</li>
          ))}
        </ul>
      </div>

      {/* Roadmap */}
      <div className="cg-card">
        <h3> Roadmap</h3>
        {roadmapStepsForFlow.length > 0 ? (
          <RoadmapFlow steps={roadmapStepsForFlow} />
        ) : (
          <p className="cg-empty-state">No roadmap available right now.</p>
        )}
      </div>

      {/* ML Predictions */}
      {safeMlPredictions.length > 0 && (
        <div className="cg-card">
          <h3> ML Predictions</h3>
          <ul>
            {safeMlPredictions.map((item, i) => (
              <li key={i}>
                {item.career} ({Number(item.match).toFixed(2)}%)
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default CareerGuidance;
