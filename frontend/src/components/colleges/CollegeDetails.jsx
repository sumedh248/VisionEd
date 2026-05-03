import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCollegeDetails, getCollegeImage } from "./collegeData";
import { supabase } from "../../supabaseClient";
import { API_BASE_URL } from "../../utils/api";
import "./Colleges.css";

function getAlumniName(alumni) {
  return alumni.users?.name || alumni.users?.email?.split("@")[0] || "Alumni member";
}

function getAlumniInitials(alumni) {
  return getAlumniName(alumni)
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function CollegeDetails() {
  const { collegeId } = useParams();
  const [college, setCollege] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState({});

  const handleConnect = async (receiverId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        alert("Please login to connect with alumni.");
        return;
      }
      
      const response = await fetch(`${API_BASE_URL}/connections`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ receiver_id: receiverId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to connect");
      }
      
      setConnectionStatus(prev => ({ ...prev, [receiverId]: "Sent" }));
      alert("Connection request sent!");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadCollege = async () => {
      try {
        setStatus("loading");
        const data = await fetchCollegeDetails(collegeId);

        if (isMounted) {
          setCollege(data);
          setStatus(data ? "ready" : "missing");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Could not load this college.");
          setStatus("error");
        }
      }
    };

    loadCollege();

    return () => {
      isMounted = false;
    };
  }, [collegeId]);

  if (status === "loading") {
    return (
      <section className="college-detail-page">
        <div className="college-state">
          <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
          Loading college...
        </div>
      </section>
    );
  }

  if (status === "error" || status === "missing") {
    return (
      <section className="college-detail-page">
        <div className="college-state college-state--error">
          <i className="fas fa-circle-exclamation" aria-hidden="true"></i>
          {status === "missing" ? "College not found." : error}
        </div>
        <Link to="/colleges" className="college-back-link">
          <i className="fas fa-arrow-left" aria-hidden="true"></i>
          Back to colleges
        </Link>
      </section>
    );
  }

  return (
    <section className="college-detail-page">
      <div
        className="college-banner"
        style={{ backgroundImage: `url("${getCollegeImage(college.image)}")` }}
      >
        <div className="college-banner__shade">
          <Link to="/colleges" className="college-back-link college-back-link--banner">
            <i className="fas fa-arrow-left" aria-hidden="true"></i>
            Colleges
          </Link>
          <div>
            <p className="college-banner__location">
              <i className="fas fa-location-dot" aria-hidden="true"></i>
              {college.location || "Location not added"}
            </p>
            <h1>{college.name || "Unnamed college"}</h1>
            {college.description && <p>{college.description}</p>}
            {college.website && (
              <a href={college.website} target="_blank" rel="noreferrer" className="college-site-link">
                Visit website
                <i className="fas fa-up-right-from-square" aria-hidden="true"></i>
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="college-detail-shell">
        <section className="college-detail-section">
          <div className="college-section-heading">
            <span>Courses</span>
            <h2>Available courses</h2>
          </div>

          {college.courses.length ? (
            <div className="course-list">
              {college.courses.map((course) => (
                <article className="course-card" key={course.id}>
                  <i className="fas fa-graduation-cap" aria-hidden="true"></i>
                  <div>
                    <h3>{course.course_name || "Course name not added"}</h3>
                    <p>{course.duration || "Duration not added"}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="college-state">No courses have been added for this college yet.</div>
          )}
        </section>

        <section className="college-detail-section">
          <div className="college-section-heading">
            <span>Alumni</span>
            <h2>Alumni from this college</h2>
          </div>

          {college.alumni.length ? (
            <div className="alumni-grid">
              {college.alumni.map((alumni) => (
                <article className="alumni-card" key={alumni.id}>
                  {alumni.users?.profile_image ? (
                    <img src={alumni.users.profile_image} alt="" />
                  ) : (
                    <div className="alumni-avatar">{getAlumniInitials(alumni)}</div>
                  )}
                  <div>
                    <div className="alumni-card__name-row">
                      <h3>{getAlumniName(alumni)}</h3>
                      {alumni.verified && (
                        <span title="Verified alumni">
                          <i className="fas fa-circle-check" aria-hidden="true"></i>
                        </span>
                      )}
                    </div>
                    <p>
                      {[alumni.degree, alumni.field_of_study].filter(Boolean).join(" in ") ||
                        "Education details not added"}
                    </p>
                    <p className="alumni-card__work">
                      {[alumni.users?.job_role, alumni.users?.current_company]
                        .filter(Boolean)
                        .join(" at ") || "Work details not added"}
                    </p>
                    <button 
                      style={{ 
                        marginTop: "1rem", 
                        backgroundColor: connectionStatus[alumni.user_id] === "Sent" ? "#4caf50" : "var(--primary-color, #4361ee)", 
                        color: "white", 
                        padding: "0.5rem 1rem", 
                        borderRadius: "4px", 
                        border: "none", 
                        cursor: connectionStatus[alumni.user_id] === "Sent" ? "default" : "pointer",
                        fontWeight: "500",
                        fontSize: "0.875rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                      onClick={() => handleConnect(alumni.user_id)}
                      disabled={connectionStatus[alumni.user_id] === "Sent"}
                    >
                      <i className={connectionStatus[alumni.user_id] === "Sent" ? "fas fa-check" : "fas fa-user-plus"} aria-hidden="true"></i>
                      {connectionStatus[alumni.user_id] === "Sent" ? "Request Sent" : "Create Connection"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="college-state">No alumni have been listed for this college yet.</div>
          )}
        </section>
      </div>
    </section>
  );
}

export default CollegeDetails;
