import React, { useState } from "react";
import "./Admin.css";

function Admin() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="admin">

      {/* Header */}
      <div className="header">
        <h2 className="title">Admin Dashboard</h2>
        <button className="btn btn-success" onClick={() => setShowForm(true)}>
          + Add Test
        </button>
      </div>

      {/* Top Cards */}
      <div className="cards">
        <div className="card">
          <i className="fas fa-users icon"></i>
          <p>Total Students</p>
          <h3>120</h3>
        </div>

        <div className="card">
          <i className="fas fa-user-check icon"></i>
          <p>Active Users</p>
          <h3>95</h3>
        </div>

        <div className="card">
          <i className="fas fa-file-alt icon"></i>
          <p>Tests Taken</p>
          <h3>300</h3>
        </div>

        <div className="card">
          <i className="fas fa-chart-line icon"></i>
          <p>Growth</p>
          <h3>+12%</h3>
        </div>
      </div>

      {/* Student Table */}
      <div className="table-section">
        <h4><i className="fas fa-user me-2"></i>Manage Students</h4>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Score</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Rahul Patil</td>
              <td>rahul@gmail.com</td>
              <td>78%</td>
              <td>
                <button className="btn btn-sm btn-success">View</button>
                <button className="btn btn-sm btn-danger ms-2">Delete</button>
              </td>
            </tr>

            <tr>
              <td>Anita Sharma</td>
              <td>anita@gmail.com</td>
              <td>85%</td>
              <td>
                <button className="btn btn-sm btn-success">View</button>
                <button className="btn btn-sm btn-danger ms-2">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <h4><i className="fas fa-chart-pie me-2"></i>Platform Analytics</h4>
        <div className="chart-placeholder">
          📊 Chart (add Chart.js later)
        </div>
      </div>

      {/* Add Test Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">

            <h4>Add New Test</h4>

            <input
              type="text"
              placeholder="Test Title"
              className="form-control mb-2"
            />

            <textarea
              placeholder="Description"
              className="form-control mb-2"
            ></textarea>

            <input
              type="number"
              placeholder="Duration (minutes)"
              className="form-control mb-3"
            />

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button className="btn btn-success">
                Save Test
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;