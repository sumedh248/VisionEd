import React from "react";
import Suggestimg from "../../assets/suggestions.jpeg";
export default function Working2() {
  return (
    <div>
      <div
        className="container text-black mb-5 px-2 px-md-3"
        style={{ minHeight: "auto", overflow: "hidden" }}
      >
        <div
          className="row border rounded-4 g-3 g-md-0"
          style={{ backgroundColor: "#A7BD84", padding: "1.5rem" }}
        >
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <img
              src={Suggestimg}
              className="rounded-circle"
              style={{ width: "100%", maxWidth: "250px", height: "auto", aspectRatio: "1", objectFit: "cover" }}
              alt="AI Career Suggestion"
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center">
            <p className="fw-normal fs-5"></p>
            <h5 className="text-start fs-3 mb-3">
              <i style={{ color: "#000000" }}>
                {" "}
                AI based Career Suggestion{" "}
              </i>{" "}
            </h5>
            <p className="text-start fs-6 mb-3">
              Unlock your true potential with our intelligent career guidance
              system. Analyze your skills, interests, and strengths to discover
              career paths tailored just for you. <br /> Our system evaluates
              your aptitude and interests to suggest the most suitable careers
              with precision and clarity.
            </p>
            <div className="row mb-3 g-2">
              <div className="col-6 col-sm-5">
                <span className="fs-4 fw-medium d-block" style={{ color: "#158000" }}>
                  100+
                </span>
                <p className="mb-0 small">Careers Available</p>
              </div>
              <div className="col-6 col-sm-5">
                <span className="fs-4 fw-medium d-block" style={{ color: "#000000" }}>
                  50+
                </span>
                <p className="mb-0 small">Colleges Supports Us</p>
              </div>
            </div>

            <a className="btn btn-success align-self-start">Show now</a>
          </div>
        </div>
      </div>
    </div>
  );
}
