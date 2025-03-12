import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeLoading, setIsCodeLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [countdown, setCountdown] = useState(0); 
  const navigate = useNavigate();

  // Handle sending verification code
  const handleGetCode = async () => {
    setError('');
    setIsCodeLoading(true);

    try {
      await api.post('/user/withoutToken/getVerificationCode', { email }, { withCredentials: true });
      setSuccessMessage('Verification code has been sent to your email.');
      setCountdown(60); 
    } catch (err) {
      let errorMessage = 'Failed to send verification code';
      if (err.response) {
        errorMessage = err.response.data?.message || `Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Unable to connect to server';
      }
      console.error('Failed to send verification code:', err);
      setError(errorMessage);
    } finally {
      setIsCodeLoading(false);
    }
  };

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Handle form submission (update password)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match');
      setIsLoading(false);
      return;
    }

    try {
      await api.post('/user/withoutToken/forgetPassword', {
        email,
        code,
        newPassword,
        confirmPassword,
      }, { withCredentials: true });

      setSuccessMessage('Password updated successfully. Redirecting to login page...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      let errorMessage = 'Failed to update password';
      if (err.response) {
        errorMessage = err.response.data?.message || `Error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Unable to connect to server';
      }
      console.error('Failed to update password:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getCodeButtonText = () => {
    if (isCodeLoading) return 'Sending...';
    if (countdown > 0) return `${countdown}s Resend`;
    return 'Get Code';
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading || isCodeLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="code">Verification Code</label>
          <div className="code-input-group">
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="get-code-btn"
              onClick={handleGetCode}
              disabled={isCodeLoading || countdown > 0 || !email}
            >
              {getCodeButtonText()}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Update Password'}
        </button>
      </form>

      <div className="back-link">
        <Link to="/login">Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;