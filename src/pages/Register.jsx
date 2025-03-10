import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../styles/Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    code: '',
    userType: '0' // 默认选择学生
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false); // 发送验证码的状态
  const navigate = useNavigate();

  const userTypes = [
    { value: '0', label: 'Student' },
    { value: '1', label: 'Teacher' },
    { value: '2', label: 'Librarian' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 发送验证码
  const handleSendCode = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    setIsSendingCode(true);
    setError('');

    try {
      await api.post('/user/withoutToken/getVerificationCode', {
        email: formData.email
      });
      alert('Verification code sent successfully!');
    } catch (err) {
      let errorMessage = 'Failed to send verification code';
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Unable to connect to server';
      }
      setError(errorMessage);
    } finally {
      setIsSendingCode(false);
    }
  };

  const validateForm = () => {
    // 密码验证
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // 手机号验证（示例：简单验证11位数字）
    if (!/^\d{11}$/.test(formData.phone)) {
      setError('Invalid phone number (11 digits required)');
      return false;
    }

    // 验证码验证（示例：6位数字）
    if (!/^\d{6}$/.test(formData.code)) {
      setError('Verification code must be 6 digits');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await api.post('/user/withoutToken/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        code: formData.code,
        userType: parseInt(formData.userType)
      });

      localStorage.setItem('authToken', response.data.token);
      navigate('/');
      
    } catch (err) {
      let errorMessage = 'Registration failed, please try again';
      
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Unable to connect to server';
      }
      
      console.error('Registration error:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h1>Library Management System</h1>
      </header>

      <nav className="navbar">
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/books">Books</Link>
          <Link to="/about">About</Link>
        </div>
        <div className="user-section">
          <Link to="/login" className="auth-link">Login</Link>
          <Link to="/register" className="auth-link">Register</Link>
        </div>
      </nav>

      <main className="main-content">
        <div className="register-container">
          <h2>User Registration</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={isLoading}
                pattern="\d{11}"
                placeholder="11 digit phone number"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <div className="code-input-group">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  disabled={isLoading}
                  maxLength="6"
                  placeholder="6 digit code"
                  required
                />
                <button 
                  type="button" 
                  className="send-code-btn"
                  onClick={handleSendCode}
                  disabled={isSendingCode || isLoading}
                >
                  {isSendingCode ? 'Sending...' : 'Send Code'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="userType">User Type</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                disabled={isLoading}
                required
              >
                {userTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
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

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <Link to="/login">Login now</Link>
          </p>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2023 Library Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Register;