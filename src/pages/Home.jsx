import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <Link to="/" className="logo">Library Management System</Link>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </nav>
      
      <main className="main-content">
        <h1>Welcome to Library Management System</h1>
        <p>Please login or register to access more features</p>
      </main>
    </div>
  );
}

export default Home;