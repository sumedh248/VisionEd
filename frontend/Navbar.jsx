import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/",          icon: "fas fa-home",       label: "Home"      },
  { to: "/dashboard", icon: "fas fa-chart-line",  label: "Dashboard" },
  { to: "/career",      icon: "fas fa-brain",       label: "Tests"     },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Sidebar({ setOpen: parentSetOpen }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (parentSetOpen) parentSetOpen(open);
  }, [open, parentSetOpen]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const initials = user ? getInitials(user.name) : null;

  return (
    <div className={`sidebar ${open ? "open" : "collapsed"}`}>

      {/* Logo / Toggle */}
      <h4 className="logo" onClick={() => setOpen(!open)} title={open ? "Collapse" : "Expand"}>
        {open ? <>Vision<span>Ed</span></> : "VE"}
      </h4>

      {/* Navigation */}
      <nav className="menu">
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <Link
            key={to}
            to={to}
            className={location.pathname === to ? "active" : ""}
            title={!open ? label : undefined}
          >
            <i className={icon} />
            {open && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Profile */}
      <div className="profile">
        <div className="profile-avatar">
          {initials
            ? initials
            : <i className="fas fa-user" />
          }
        </div>

        {open && (
          <div className="profile-info">
            {user ? (
              <>
                <p>{user.name}</p>
                <Link
                  to="/login"
                  className="profile-action logout"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <p>Guest</p>
                <Link to="/login" className="profile-action login">
                  Sign in
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;