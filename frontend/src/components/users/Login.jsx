import React from "react";
import Loginimg from "../../assets/login.jpeg";

export default function Login() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="row border rounded shadow bg-white"
        style={{ width: "800px", height: "500px", backgroundColor: "#28a745" }}
      >
        <div
          style={{ backgroundColor: "#28a745" }}
          className="col-6 d-flex flex-column justify-content-center align-items-center p-4 rounded"
        >
          <h2 className="mb-4 fw-bold">Login</h2>

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
            <input
              type="text"
              className="form-control rounded-pill border-0 bg-secondary bg-opacity-25"
              placeholder="Password"
            />
            <div
              className="rounded-circle bg-white d-flex justify-content-center align-items-center"
              style={{ width: "45px", height: "45px", flexShrink: 0 }}
            >
              <i className="fas fa-lock fs-5"></i>
            </div>
          </div>

          <button className="btn btn-dark w-100 rounded-pill fw-bold">
            Login
          </button>
        </div>
        <div className="col-6 p-0 rounded overflow-hidden">
          <img src={Loginimg} alt="" className="w-100 h-100 object-fit-cover" />
        </div>

        
      </div>
    </div>
  );
}
