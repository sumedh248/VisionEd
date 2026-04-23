import React from "react";
import { Link } from "react-router-dom";
import Signupimg from "../../assets/signup.jpeg";

export default function Signup() {
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#E8EDF2" }}
    >
      <div
        className="row border rounded shadow bg-white"
        style={{ width: "800px", height: "450px", backgroundColor: "#28a745" }}
      >
        <div className="col-6 p-0 rounded overflow-hidden">
          <img
            src={Signupimg}
            alt=""
            className="w-100 h-100 object-fit-cover"
          />
        </div>

        <div
          style={{ backgroundColor: "#ffffff" }}
          className="col-6 d-flex flex-column justify-content-center align-items-center p-4 rounded"
        >
          <h2 className="mb-4 fw-bold" style={{ color: "#5d9700"}}>Signup to VisionED</h2>

          {/* username */}
          <div className="mb-3 w-100 d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-white d-flex justify-content-center align-items-center"
              style={{ width: "45px", height: "45px", flexShrink: 0 }}
            >
              <i className="fas fa-user fs-5"></i>
            </div>
            <input
              type="text"
              className="form-control rounded-pill border-0 bg-secondary bg-opacity-25"
              placeholder="Username"
            />
          </div>
          {/* email */}
          <div className="mb-3 w-100 d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-white d-flex justify-content-center align-items-center"
              style={{ width: "45px", height: "45px", flexShrink: 0 }}
            >
              <i className="fas fa-envelope fs-5"></i>
            </div>
            <input
              type="text"
              className="form-control rounded-pill border-0 bg-secondary bg-opacity-25"
              placeholder="Email Address"
            />
          </div>

          {/* phone number */}
          <div className="mb-3 w-100 d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-white d-flex justify-content-center align-items-center"
              style={{ width: "45px", height: "45px", flexShrink: 0 }}
            >
              <i className="fas fa-phone fs-5"></i>
            </div>
            <input
              type="text"
              className="form-control rounded-pill border-0 bg-secondary bg-opacity-25"
              placeholder="Phone Number"
            />
          </div>

          {/* password */}
          <div className="mb-3 w-100 d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-white d-flex justify-content-center align-items-center"
              style={{ width: "45px", height: "45px", flexShrink: 0 }}
            >
              <i className="fas fa-lock fs-5"></i>
            </div>
            <input
              type="text"
              className="form-control rounded-pill border-0 bg-secondary bg-opacity-25"
              placeholder="Phone Number"
            />
          </div>

          {/* confirm password */}
          <div className="mb-3 w-100 d-flex align-items-center gap-2">
            <div
              className="rounded-circle bg-white d-flex justify-content-center align-items-center"
              style={{ width: "45px", height: "45px", flexShrink: 0 }}
            >
              <i className="fas fa-lock fs-5"></i>
            </div>
            <input
              type="text"
              className="form-control rounded-pill border-0 bg-secondary bg-opacity-25"
              placeholder="Phone Number"
            />
          </div>

          <button className="btn btn-dark w-90 rounded-pill fw-bold">
            Signup
          </button>

          <p className="mt-3">
            Aldready have an acoount? <Link to="/Login">Login Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
