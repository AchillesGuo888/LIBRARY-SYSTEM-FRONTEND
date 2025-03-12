import React, { useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import '../styles/Home.css';

function Home() {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { isAuthenticated, userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleLogout = useCallback(() => {
    dispatch(logout()); 
    navigate('/'); 
  }, [dispatch, navigate]);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  
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

        </div>
        <div className="user-section">
          {isAuthenticated ? (
            <div className="user-menu">
              <div 
                className="user-icon" 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {userInfo?.username?.charAt(0).toUpperCase() || 'U'}
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
          {isAuthenticated
            ? `Welcome back, ${userInfo?.username || 'User'}!`
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