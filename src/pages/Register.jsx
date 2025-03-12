import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../utils/api';
import '../styles/Register.css';
import { loginSuccess } from '../store/authSlice';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    code: '',
    userType: '0'
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 确保 userTypes 被使用
  const userTypes = [
    { value: '0', label: 'Student' },
    { value: '1', label: 'Teacher' },
    { value: '2', label: 'Librarian' }
  ];

  // 确保 handleChange 被使用（需要绑定到输入框）
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 确保 handleSendCode 被使用（需要绑定到发送验证码按钮）
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
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!/^\d{11}$/.test(formData.phone)) {
      setError('Invalid phone number (11 digits required)');
      return false;
    }

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

      dispatch(loginSuccess({
        token: response.data.token,
        userInfo: {
          username: formData.username,
          email: formData.email,
          userType: formData.userType
        }
      }));
      
      navigate('/');
      
    } catch (err) {
      let errorMessage = 'Registration failed, please try again';
      
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Unable to connect to server';
      }
      
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
                onChange={handleChange}  // 确保绑定
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
                onChange={handleChange}  // 确保绑定
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
                onChange={handleChange}  // 确保绑定
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
                  onChange={handleChange}  // 确保绑定
                  disabled={isLoading}
                  maxLength="6"
                  placeholder="6 digit code"
                  required
                />
                <button 
                  type="button" 
                  className="send-code-btn"
                  onClick={handleSendCode}  // 确保绑定
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
                onChange={handleChange}  // 确保绑定
                disabled={isLoading}
                required
              >
                {userTypes.map((type) => (  // 确保使用 userTypes
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
                onChange={handleChange}  // 确保绑定
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
                onChange={handleChange}  // 确保绑定
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