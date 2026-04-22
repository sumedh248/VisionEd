import React from "react";
import Collegeimg from "../../assets/college.jpeg";
export default function Working3() {
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
              src={Collegeimg}
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
                Best colleges for your path
              </i>{" "}
            </h5>
            <p class="text-start">
              Find the right college that matches your goals, skills, and
              aspirations. We help you explore top institutions based on your
              performance and career interests.
              <br /> Get personalized college recommendations aligned with your
              career goals and academic profile. Make informed decisions with
              reliable insights.
            </p>
            <div className="row mb-3">
              <div className="col-3  me-5">
                <span className="fs-4 fw-medium" style={{ color: "#158000" }}>
                  100+
                </span>
                <p>Best colleges</p>
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
