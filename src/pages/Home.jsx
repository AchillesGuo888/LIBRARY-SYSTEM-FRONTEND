import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Home.css';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken'); // 清除缓存的 token
    setIsLoggedIn(false); // 设置登录状态为 false
    setUsername(''); // 清空用户名
    navigate('/'); // 导航到首页
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUsername(decoded.username || 'User');
      } catch (error) {
        handleLogout(); // 如果 token 无效，执行注销操作
      }
    }

    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleLogout]);

  const handleProfile = () => {
    navigate('/edit-profile');
    setShowDropdown(false);
  };

  const handleChangePassword = () => {
    navigate('/change-password');
    setShowDropdown(false);
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
          {isLoggedIn ? (
            <div className="user-menu">
              <div 
                className="user-icon" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {username.charAt(0).toUpperCase()}
              </div>
              {showDropdown && (
                <div className="dropdown-menu">
                  <button onClick={handleProfile}>View Profile</button>
                  <button onClick={handleChangePassword}>Change Password</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <h2>Welcome to Library Management System</h2>
        <p>
          {isLoggedIn 
            ? `Welcome back, ${username}!`
            : 'Please login or register to access more features'}
        </p>
      </main>

      <footer className="footer">
        <p>&copy; 2023 Library Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;