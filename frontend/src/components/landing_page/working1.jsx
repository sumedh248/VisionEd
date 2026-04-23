import React from "react";
import testimg from "../../assets/test.jpeg";
import { Link, useNavigate } from "react-router-dom";
export default function Working1() {
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
              src={testimg}
              className="rounded-circle"
              style={{ width: "100%", maxWidth: "250px", height: "auto", aspectRatio: "1", objectFit: "cover" }}
              alt="Starting Quiz"
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center">
            <p className="fw-normal fs-5"></p>
            <h5 className="text-start fs-3 mb-3">
              <i style={{ color: "#000000" }}>Starting Quizz</i>{" "}
            </h5>
            <p className="text-start fs-6 mb-3">
              Discover your strengths, interests, and potential with our
              AI-powered aptitude quiz. Get personalized career insights
              designed to guide you toward the right path. <br /> Find your
              perfect career path in minutes with smart analysis and
              personalized results.
            </p>
            <div className="row mb-3 g-2">
              <div className="col-6 col-sm-5">
                <span className="fs-4 fw-medium d-block" style={{ color: "#158000" }}>
                  100+
                </span>
                <p className="mb-0 small">Students Interested</p>
              </div>
              <div className="col-6 col-sm-5">
                <span className="fs-4 fw-medium d-block" style={{ color: "#000000" }}>
                  50+
                </span>
                <p className="mb-0 small">Colleges Supports</p>
              </div>
            </div>

            <Link
            to="/quiz"
            className="btn btn-success align-self-start"
          >
            Start Quiz
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
