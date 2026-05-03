import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { fetchSessionUser } from "../../utils/session";

const getReturnPath = (location) => {
  const pathname = location?.pathname || "/";
  const search = location?.search || "";
  const hash = location?.hash || "";

  return `${pathname}${search}${hash}`;
};

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      const sessionUser = await fetchSessionUser();

      if (isMounted) {
        setAuthStatus(sessionUser ? "allowed" : "denied");
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, location.search, location.hash]);

  if (authStatus === "checking") {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          padding: "24px",
          fontFamily: "'DM Sans', sans-serif",
          color: "#1a3328",
        }}
      >
        Checking your login session...
      </div>
    );
  }

  if (authStatus !== "allowed") {
    return <Navigate to="/login" replace state={{ from: getReturnPath(location) }} />;
  }

  return children;
}
