import React from "react";
import Suggestimg from "../../assets/suggestions.jpeg";
export default function Working2() {
  return (
    <div>
      <div
        class="container text-black mb-5"
        style={{ height: "50vh", overflow: "hidden" }}
      >
        <div
          class="row border rounded-4"
          style={{ height: "100%", backgroundColor: "#A7BD84" }}
        >
          <div class="col-6  d-flex align-items-center justify-content-center">
            <img
              src={Suggestimg}
              class="rounded-circle"
              style={{ width: "300px", height: "300px", objectFit: "cover" }}
              alt="..."
            />
          </div>
          <div class="col mt-3">
            <p className="fw-normal fs-5"></p>
            <h5 class="text-start fs-3">
              <i style={{ color: "#000000" }}>
                {" "}
                Ai based Career Suggestion{" "}
              </i>{" "}
            </h5>
            <p class="text-start">
              Unlock your true potential with our intelligent career guidance
              system. Analyze your skills, interests, and strengths to discover
              career paths tailored just for you. <br /> Our system evaluates
              your aptitude and interests to suggest the most suitable careers
              with precision and clarity.
            </p>
            <div className="row mb-3">
              <div className="col-3  me-5">
                <span className="fs-4 fw-medium" style={{ color: "#158000" }}>
                  100+
                </span>
                <p>Careers Available </p>
              </div>
              <div className="col-3  me-5">
                <span className="fs-4 fw-medium" style={{ color: "#000000" }}>
                  50+
                </span>
                <p>Colleges Supports Us</p>
              </div>
            </div>

            <a className="btn btn-success ">Show now</a>
          </div>
        </div>
      </div>
    </div>
  );
}
