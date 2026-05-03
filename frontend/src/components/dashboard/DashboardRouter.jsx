import React, { useEffect, useState } from 'react';
import Student from './Student';
import AlumniDashboard from './AlumniDashboard';
import { useNavigate } from 'react-router-dom';

const DashboardRouter = () => {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role);
      } catch (e) {
        console.error("Failed to parse user from local storage");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (role === 'alumni') {
    return <AlumniDashboard />;
  }
  
  if (role === 'student' || role === 'admin') {
    return <Student />;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#1a3328" }}>
      Loading dashboard...
    </div>
  );
};

export default DashboardRouter;
