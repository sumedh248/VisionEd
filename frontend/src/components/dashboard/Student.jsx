import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../utils/api";
import { getStoredUser } from "../../utils/session";
import RoadmapFlow from "../career/RoadmapFlow";
import "./Student.css";
const SCORE_MAX = 5;

const toPercent = (value, max = SCORE_MAX) => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((numeric / max) * 100));
};

const formatMetricLabel = (label) =>
  String(label || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase())
    .trim();

const formatSavedDate = (value) => {
  if (!value) {
    return "your latest saved result";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "your latest saved result";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const roadmapToPreviewItems = (steps, roadmap) => {
  if (Array.isArray(steps) && steps.length > 0) {
    return steps.slice(0, 3).map((step) => ({
      title: String(step?.title || "").trim() || "Roadmap Step",
      description: String(step?.description || "").trim(),
    }));
  }

  if (!Array.isArray(roadmap)) {
    return [];
  }

  return roadmap.slice(0, 3).map((step) => {
    const rawStep = String(step || "").trim();
    const [titlePart, ...descriptionParts] = rawStep.split(":");

    return {
      title: titlePart?.trim() || "Roadmap Step",
      description: descriptionParts.join(":").trim(),
    };
  });
};

const formatPredictionMatch = (value) => {
  const numeric = Number(value);

  if (!Number.isFinite(numeric)) {
    return "Recommended";
  }

  return `${numeric.toFixed(2)}% match`;
};

function Student() {
  const location = useLocation();
  const storedUser = getStoredUser();
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
        } = await import("../../supabaseClient").then((m) => m.supabase.auth.getSession());

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
          throw new Error(data.message || "Failed to load saved dashboard data");
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
          setFetchStatus(`Showing your latest saved result from ${formatSavedDate(latest.createdAt)}.`);
        }
      } catch (error) {
        if (isMounted) {
          setFetchStatus(error.message || "Could not fetch saved dashboard data.");
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

  const scoreEntries = useMemo(
    () =>
      Object.entries(safeScores)
        .filter(([, value]) => Number.isFinite(Number(value)))
        .sort((first, second) => Number(second[1]) - Number(first[1])),
    [safeScores]
  );

  const topScoreEntry = scoreEntries[0];
  const topScorePercent = Number.isFinite(Number(result?.score))
    ? toPercent(result.score)
    : topScoreEntry
      ? toPercent(topScoreEntry[1])
      : 0;
  const overallProgress = scoreEntries.length
    ? Math.round(
        scoreEntries.reduce((total, [, value]) => total + toPercent(value), 0) / scoreEntries.length
      )
    : 0;
  const predictionList = safeMlPredictions.length
    ? safeMlPredictions
    : result?.career
      ? [{ career: result.career, match: topScorePercent }]
      : [];
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
  const viewerName = storedUser?.name || result?.username || "";
  const topAreaLabel = formatMetricLabel(topScoreEntry?.[0] || result?.category || "career fit");
  const careerMatchCount = predictionList.length || (result?.career ? 1 : 0);

  if (isLoading) {
    return (
      <div className="dash">
        <div className="dash-feedback dash-feedback--loading">
          <h2>Loading dashboard...</h2>
          <p>We are fetching your latest saved result from the database.</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="dash">
        <div className="dash-feedback">
          <h2>No dashboard data yet</h2>
          <p>{saveStatus || "Take the career test to generate your first saved dashboard snapshot."}</p>
          <Link to="/quiz" className="dash-empty-link">
            Take Career Test
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dash">
      <div className="dash-header">
        <div className="dash-eyebrow">Student Portal</div>
        <h2 className="dash-title">Dashboard</h2>
        <p className="dash-sub">
          {viewerName ? `Welcome back, ${viewerName}. ` : "Welcome back. "}
          Here is your latest saved career guidance overview from the database.
        </p>
        <div className="dash-status">
          <span className="dash-status__pill">{result.career || "Career recommendation"}</span>
          <span className="dash-status__text">
            {saveStatus || `Showing your latest saved result from ${formatSavedDate(result.createdAt)}.`}
          </span>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Link to="/quiz" className="dash-empty-link">
            Take Another Test
          </Link>
        </div>
      </div>

      <div className="dash-section-label">
        <span className="dash-section-label__tag">Overview</span>
      </div>

      <div className="cards">
        <div className="card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          </div>
          <p>Test Score</p>
          <h3>{topScorePercent}%</h3>
          <span className="card-badge">{topAreaLabel}</span>
        </div>

        <div className="card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
          <p>Progress</p>
          <h3>{overallProgress}%</h3>
          <span className="card-badge">{scoreEntries.length || 0} scored areas</span>
        </div>

        <div className="card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
          </div>
          <p>Careers</p>
          <h3>{careerMatchCount}</h3>
          <span className="card-badge">AI suggested matches</span>
        </div>

        <div className="card">
          <div className="card-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <p>Colleges</p>
          <h3>{safeColleges.length}</h3>
          <span className="card-badge">{safeSkills.length} skills mapped</span>
        </div>
      </div>

      <div className="dash-section-label">
        <span className="dash-section-label__tag">Details</span>
      </div>

      <div className="sections">
        <div className="section">
          <div className="section-head">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <div>
              <h4>Top Careers</h4>
              <p className="section-sub">Based on your latest saved prediction result.</p>
            </div>
          </div>
          {predictionList.length > 0 ? (
            <ul className="dash-list">
              {predictionList.slice(0, 4).map((item, index) => (
                <li key={`${item.career}-${index}`} className="dash-list-item">
                  <span className="dash-list-item__copy">{item.career}</span>
                  <span className="dash-list-pill">{formatPredictionMatch(item.match)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-empty-text">No career predictions available yet.</p>
          )}
        </div>

        <div className="section">
          <div className="section-head">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <div>
              <h4>Recommended Colleges</h4>
              <p className="section-sub">Institutions linked to your strongest-fit path.</p>
            </div>
          </div>
          {safeColleges.length > 0 ? (
            <ul className="dash-list">
              {safeColleges.slice(0, 4).map((college) => (
                <li key={college} className="dash-list-item">
                  <span className="dash-list-item__copy">{college}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-empty-text">No college recommendations are saved yet.</p>
          )}
        </div>

        <div className="section">
          <div className="section-head">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <div>
              <h4>Skills Required</h4>
              <p className="section-sub">Priority areas for the recommended career path.</p>
            </div>
          </div>
          {safeSkills.length > 0 ? (
            <ul className="dash-list">
              {safeSkills.slice(0, 5).map((skill) => (
                <li key={skill} className="dash-list-item">
                  <span className="dash-list-item__copy">{skill}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dash-empty-text">No required skills are saved yet.</p>
          )}
        </div>
      </div>

      <div className="dash-section-label">
        <span className="dash-section-label__tag">Performance</span>
      </div>

      <div className="dash-bottom">
        <div className="section">
          <div className="section-head">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="22 6 13.5 14.5 8.5 9.5 2 16" />
              <polyline points="16 6 22 6 22 12" />
            </svg>
            <div>
              <h4>Score Breakdown</h4>
              <p className="section-sub">A quick view of your saved aptitude dimensions.</p>
            </div>
          </div>
          {scoreEntries.length > 0 ? (
            <div className="progress-list">
              {scoreEntries.map(([label, value]) => {
                const percentage = toPercent(value);

                return (
                  <div className="prog-item" key={label}>
                    <div className="prog-head">
                      <p>{formatMetricLabel(label)}</p>
                      <strong>{percentage}%</strong>
                    </div>
                    <div className="prog-bar">
                      <div className="prog-fill" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="dash-empty-text">No saved score breakdown is available yet.</p>
          )}
        </div>

        <div className="section">
          <div className="section-head">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20h9" />
              <path d="M12 4h9" />
              <path d="M4 9h16" />
              <path d="M4 15h16" />
              <path d="M8 4v16" />
            </svg>
            <div>
              <h4>Roadmap Snapshot</h4>
              <p className="section-sub">The next steps saved with your latest result.</p>
            </div>
          </div>
          {roadmapStepsForFlow.length > 0 ? (
            <RoadmapFlow steps={roadmapStepsForFlow} />
          ) : (
            <p className="dash-empty-text">No roadmap steps are saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Student;
