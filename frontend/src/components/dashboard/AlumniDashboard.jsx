import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import './AlumniDashboard.css';

const AlumniDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Please log in");
      }

      const response = await fetch("http://localhost:5000/alumni/dashboard", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to load data");
      
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionAction = async (id, status) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`http://localhost:5000/connections/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update connection");
      }

      // Refresh data
      fetchDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="alumni-dash-state"><i className="fas fa-spinner fa-spin"></i> Loading Dashboard...</div>;
  if (error) return <div className="alumni-dash-state error"><i className="fas fa-exclamation-triangle"></i> {error}</div>;
  if (!data) return null;

  const { profile, connections } = data;

  return (
    <div className="alumni-dashboard">
      <div className="alumni-profile-header">
        <div className="alumni-profile-banner"></div>
        <div className="alumni-profile-content">
          <div className="alumni-avatar-large">
            {profile.profile_image ? (
              <img src={profile.profile_image} alt={profile.name} />
            ) : (
              <div className="alumni-initials">{profile.name?.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="alumni-info-main">
            <h2>{profile.name} {profile.verified && <i className="fas fa-check-circle verified-badge" title="Verified Alumni"></i>}</h2>
            <p className="alumni-college"><i className="fas fa-university"></i> {profile.colleges?.name || "College not set"}</p>
            <p className="alumni-degree">{profile.degree} in {profile.field_of_study}</p>
          </div>
        </div>
      </div>

      <div className="alumni-sections-container">
        <div className="alumni-connections-section">
          <div className="section-header">
            <h3><i className="fas fa-users"></i> Connection Requests</h3>
            <span className="badge">{connections.length}</span>
          </div>

          {connections.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>No connection requests yet.</p>
            </div>
          ) : (
            <div className="connections-list">
              {connections.map(conn => (
                <div key={conn.id} className={`connection-card status-${conn.status}`}>
                  <div className="connection-user">
                    <div className="connection-avatar">
                      {conn.sender?.profile_image ? (
                        <img src={conn.sender.profile_image} alt={conn.sender.name} />
                      ) : (
                        <span>{conn.sender?.name?.charAt(0).toUpperCase() || "?"}</span>
                      )}
                    </div>
                    <div className="connection-details">
                      <h4>{conn.sender?.name || "Unknown User"}</h4>
                      <p>{conn.sender?.email}</p>
                      <span className={`status-badge ${conn.status}`}>
                        {conn.status.charAt(0).toUpperCase() + conn.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  {conn.status === 'pending' && (
                    <div className="connection-actions">
                      <button 
                        className="btn-accept" 
                        onClick={() => handleConnectionAction(conn.id, 'accepted')}
                      >
                        <i className="fas fa-check"></i> Accept
                      </button>
                      <button 
                        className="btn-reject" 
                        onClick={() => handleConnectionAction(conn.id, 'rejected')}
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;
