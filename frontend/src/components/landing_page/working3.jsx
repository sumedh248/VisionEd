import React from "react";
import Collegeimg from "../../assets/college.jpeg";
import { Link, useNavigate } from "react-router-dom";


export default function Working3() {
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
              src={Collegeimg}
              className="rounded-circle"
              style={{ width: "100%", maxWidth: "250px", height: "auto", aspectRatio: "1", objectFit: "cover" }}
              alt="Best Colleges"
            />
          </div>
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center">
            <p className="fw-normal fs-5"></p>
            <h5 className="text-start fs-3 mb-3">
              <i style={{ color: "#000000" }}>
                {" "}
                Best colleges for your path
              </i>{" "}
            </h5>
            <p className="text-start fs-6 mb-3">
              Find the right college that matches your goals, skills, and
              aspirations. We help you explore top institutions based on your
              performance and career interests.
              <br /> Get personalized college recommendations aligned with your
              career goals and academic profile. Make informed decisions with
              reliable insights.
            </p>
            <div className="row mb-3 g-2">
              <div className="col-6 col-sm-5">
                <span className="fs-4 fw-medium d-block" style={{ color: "#158000" }}>
                  100+
                </span>
                <p className="mb-0 small">Best colleges</p>
              </div>
              <div className="col-6 col-sm-5">
                <span className="fs-4 fw-medium d-block" style={{ color: "#000000" }}>
                  50+
                </span>
                <p className="mb-0 small">Colleges Supports Us</p>
              </div>
            </div>

            <Link
            to="/career"
            className="btn btn-success align-self-start"
          >
            show now
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
