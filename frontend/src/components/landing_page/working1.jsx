import React from "react";
import testimg from "../../assets/test.jpeg";
export default function Working1() {
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
              src={testimg}
              class="rounded-circle"
              style={{ width: "300px", height: "300px", objectFit: "cover" }}
              alt="..."
            />
          </div>
          <div class="col mt-3">
            <p className="fw-normal fs-5"></p>
            <h5 class="text-start fs-3">
              <i style={{ color: "#000000" }}>Starting Quizz</i>{" "}
            </h5>
            <p class="text-start">
              Discover your strengths, interests, and potential with our
              AI-powered aptitude quiz. Get personalized career insights
              designed to guide you toward the right path. <br /> Find your
              perfect career path in minutes with smart analysis and
              personalized results.
            </p>
            <div className="row mb-3">
              <div className="col-3  me-5">
                <span className="fs-4 fw-medium" style={{ color: "#158000" }}>
                  100+
                </span>
                <p>Students Intrested</p>
              </div>
              <div className="col-3  me-5">
                <span className="fs-4 fw-medium" style={{ color: "#000000" }}>
                  50+
                </span>
                <p>Colleges Supports</p>
              </div>
            </div>

            <a className="btn btn-success ">Start Quiz</a>
          </div>
        </div>
      </div>
    </div>
  );
}
