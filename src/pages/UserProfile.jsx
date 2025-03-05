import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import '../styles/UserProfile.css';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div className="profile-container">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container error-message">{error}</div>;
  }

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      
      <div className="profile-info">
        <div className="info-item">
          <span className="label">Name:</span>
          <span className="value">{user.name}</span>
        </div>

        <div className="info-item">
          <span className="label">Email:</span>
          <span className="value">{user.email}</span>
        </div>

        <div className="info-item">
          <span className="label">Phone:</span>
          <span className="value">{user.phone}</span>
        </div>

        <div className="info-item">
          <span className="label">Address:</span>
          <span className="value">{user.address}</span>
        </div>
      </div>

      <div className="actions">
        <Link to="/edit-profile" className="edit-btn">Edit Profile</Link>
        <Link to="/change-password" className="change-password-link">Change Password</Link>
      </div>
    </div>
  );
}

export default UserProfile;