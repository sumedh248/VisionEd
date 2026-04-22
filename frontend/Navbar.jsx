import React, { useState } from "react";
import "./Navbar.css";

function Sidebar({ setOpen: parentSetOpen }) {
  const [open, setOpen] = useState(false);
  
  // Notify parent about sidebar state
  React.useEffect(() => {
    if (parentSetOpen) parentSetOpen(open);
  }, [open, parentSetOpen]);

  return (
    <div className={open ? "sidebar open" : "sidebar collapsed"}>

      {/* Logo Toggle */}
      <h4 className="logo" onClick={() => setOpen(!open)}>
        {open ? <>Vision<span>Ed</span></> : "VE"}
      </h4>

      {/* Top Links */}
      <div className="menu">
        <a href="/">
          <i className="fas fa-home"></i>
          {open && <span> Home</span>}
        </a>

        <a href="/dashboard">
          <i className="fas fa-chart-line"></i>
          {open && <span> Dashboard</span>}
        </a>

        <a href="/test">
          <i className="fas fa-brain"></i>
          {open && <span> Tests</span>}
        </a>
      </div>

      {/* Profile Section (Bottom) */}
      <div className="profile">
        <i className="fas fa-user-circle"></i>
        {open && (
          <div className="profile-info">
            <p>Student</p>
            <small>View Profile</small>
          </div>
        )}
      </div>

    </div>
  );
}

export default Sidebar;