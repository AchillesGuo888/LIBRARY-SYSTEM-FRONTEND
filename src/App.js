import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './component/Home';
import Register from './component/Register';
import Login from './component/Login';
import ForgotPassword from './component/ForgotPassword';
import EditProfile from './component/EditProfile';
import ChangePassword from './component/ChangePassword';

function App() {
  return (
    <Router basename="/LIBRARY-SYSTEM-FRONTEND">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Routes>
    </Router>
  );
}

export default App;
