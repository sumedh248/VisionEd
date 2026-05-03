import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  collegeSortOptions,
  fetchColleges,
  getCollegeImage,
  sortColleges,
} from "./collegeData";
import "./Colleges.css";

function ExploreColleges() {
  const [colleges, setColleges] = useState([]);
  const [sortBy, setSortBy] = useState("name-asc");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadColleges = async () => {
      try {
        setStatus("loading");
        const data = await fetchColleges();

        if (isMounted) {
          setColleges(data);
          setStatus("ready");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Could not load colleges.");
          setStatus("error");
        }
      }
    };

    loadColleges();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleColleges = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? colleges.filter((college) =>
          [college.name, college.location, college.description]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(query))
        )
      : colleges;

    return sortColleges(filtered, sortBy);
  }, [colleges, search, sortBy]);

  return (
    <section className="colleges-page">
      <div className="colleges-shell">
        <header className="colleges-header">
          <span className="colleges-eyebrow">Explore colleges</span>
          <h1>Find colleges available on VisionEd</h1>
          <p>
            Browse institutions, compare course availability, and open any
            college to see its courses and alumni network.
          </p>
        </header>

        <div className="colleges-toolbar" aria-label="College filters">
          <label className="college-search">
            <i className="fas fa-magnifying-glass" aria-hidden="true"></i>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search colleges or locations"
            />
          </label>

          <label className="college-sort">
            <span>Sort</span>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              {collegeSortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {status === "loading" && (
          <div className="college-state">
            <i className="fas fa-spinner fa-spin" aria-hidden="true"></i>
            Loading colleges...
          </div>
        )}

        {status === "error" && (
          <div className="college-state college-state--error">
            <i className="fas fa-circle-exclamation" aria-hidden="true"></i>
            {error}
          </div>
        )}

        {status === "ready" && visibleColleges.length === 0 && (
          <div className="college-state">
            <i className="fas fa-building-columns" aria-hidden="true"></i>
            No colleges match your search yet.
          </div>
        )}

        {status === "ready" && visibleColleges.length > 0 && (
          <div className="college-grid">
            {visibleColleges.map((college) => (
              <Link
                to={`/colleges/${college.id}`}
                className="college-card"
                key={college.id}
              >
                <img src={getCollegeImage(college.image)} alt="" />
                <div className="college-card__body">
                  <div>
                    <h2>{college.name || "Unnamed college"}</h2>
                    <p className="college-location">
                      <i className="fas fa-location-dot" aria-hidden="true"></i>
                      {college.location || "Location not added"}
                    </p>
                  </div>
                  <p className="college-description">
                    {college.description || "No description has been added for this college yet."}
                  </p>
                  <div className="college-card__meta">
                    <span>
                      <i className="fas fa-book-open" aria-hidden="true"></i>
                      {college.coursesCount} {college.coursesCount === 1 ? "course" : "courses"}
                    </span>
                    <i className="fas fa-arrow-right" aria-hidden="true"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ExploreColleges;
