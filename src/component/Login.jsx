import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import '../styles/Login.css';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure 
} from '../store/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { loading, error } = useSelector((state) => state.auth);
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
    dispatch(loginStart());

    try {
      const response = await api.post('/user/withoutToken/login', {
        email: formData.email,
        password: formData.password
      });
      
      dispatch(loginSuccess({
        token: response.data.data.accessToken,
        userInfo: { username: response.data.data.userName }
      }));
      
      navigate('/');
    } catch (err) {
      let errorMessage = 'Login failed, please try again';
      
      if (err.response) {
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMessage = 'Unable to connect to server';
      }
      
      dispatch(loginFailure(errorMessage));
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}  
            disabled={loading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}  
            disabled={loading}
            required
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <Link to="/register">Don't have an account? Register Now</Link>
      </div>
    </div>
  );
};

export default Login;