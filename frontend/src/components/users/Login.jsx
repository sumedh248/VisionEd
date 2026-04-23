import React from "react";
import { Link } from "react-router-dom";
import Loginimg from "../../assets/login.jpeg";

export default function Login() {
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ backgroundColor: "#E8EDF2" }}
    >
      <div
        className="row border rounded shadow bg-white g-0"
        style={{ width: "800px", height: "500px", margin: "0" }}
      >
        <div className="col-6 d-flex flex-column justify-content-center align-items-center p-4 rounded">
          <h2 className="mb-4 fw-bold" style={{ color: "#5d9700"}}>Login</h2>

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
              placeholder="Password"
            />
          </div>

          <button className="btn btn-dark w-90 px-5 rounded-pill fw-bold">
            Login
          </button>
          <p className="mt-3">
            Dont have an acoount? <Link to="/Signup">Signup Now</Link>
          </p>
        </div>
        <div className="col-6 p-0 overflow-hidden" style={{ borderRadius: "0 0.375rem 0.375rem 0" }}>
          <img src={Loginimg} alt="" className="w-100 h-100" style={{ objectFit: "cover", display: "block" }} />
        </div>
      </div>
    </div>
  );
}
