import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import '../styles/ChangePassword.css';
import { logout } from '../store/authSlice';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  

  const { token } = useSelector((state) => state.auth);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/user/withToken/modifyPassword', {
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });

      console.log('Password changed successfully:', response.data);
      alert('Password changed successfully, please login again');
      

      dispatch(logout());
      navigate('/login');

    } catch (err) {
      let errorMessage = 'Failed to change password, please try again';
      
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
        if (err.response.status === 401) {
          dispatch(logout()); 
          navigate('/login');
        }
      } else if (err.request) {
        errorMessage = 'Unable to connect to server';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
          <Link 
            to="/profile" 
            className="cancel-btn"
            onClick={(e) => isLoading && e.preventDefault()}
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;