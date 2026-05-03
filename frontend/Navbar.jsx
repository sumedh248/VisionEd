import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase, upsertCurrentUser } from "./src/supabaseClient";

const NAV_ITEMS = [
  { to: "/",          icon: "fas fa-home",       label: "Home"      },
  { to: "/dashboard", icon: "fas fa-chart-line",  label: "Dashboard" },
  { to: "/career",      icon: "fas fa-brain",       label: "Tests"     },
  { to: "/colleges",  icon: "fas fa-building-columns", label: "Colleges" },
  { to: "/chat",      icon: "fas fa-comment-dots",label: "Messages"  },
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
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (parentSetOpen) parentSetOpen(open);
  }, [open, parentSetOpen]);

  useEffect(() => {
    const syncUser = async (authUser) => {
      if (!authUser) {
        setUser(null);
        return;
      }

      try {
        const profile = await upsertCurrentUser(authUser);
        localStorage.setItem("user", JSON.stringify(profile || authUser));
        setUser(profile || authUser);
      } catch (error) {
        console.error("Could not sync Supabase user profile:", error);
        localStorage.setItem("user", JSON.stringify(authUser));
        setUser(authUser);
      }
    };

    supabase.auth.getUser().then(({ data }) => syncUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("user");
    setUser(null);
  };

  const userName =
    user?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "";
  const initials = userName ? getInitials(userName) : null;

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
            className={location.pathname === to || location.pathname.startsWith(`${to}/`) ? "active" : ""}
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
                <p>{userName}</p>
                <Link
                  to="#"
                  className="profile-action logout"
                  onClick={(event) => {
                    event.preventDefault();
                    handleLogout();
                  }}
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

