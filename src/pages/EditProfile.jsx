import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../utils/api';
import '../styles/EditProfile.css';
import { logout } from '../store/authSlice';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        phone: '',
    });
    

    const { token, userInfo } = useSelector((state) => state.auth);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/user/withToken/queryUserInfo', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                
                setFormData({
                    userName: response.data.data.userName || '',
                    email: response.data.data.email || '',
                    phone: response.data.data.phone || '',
                });
            } catch (err) {
                if (err.response?.status === 401) {
                    dispatch(logout());
                    navigate('/login');
                }
            }
        };

        if (token) {
            fetchUserData();
        }
    }, [token, dispatch, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await api.post('/user/withToken/modifyUserInfo', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert('Profile updated successfully!');
            navigate('/');
        } catch (err) {
            let errorMessage = 'Failed to update profile';
            if (err.response) {
                errorMessage = err.response.data?.message || `Error: ${err.response.status}`;
                if (err.response.status === 401) {
                    dispatch(logout());
                    navigate('/login');
                }
            } else if (err.request) {
                errorMessage = 'Unable to connect to server';
            }
            setError(errorMessage); 
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profile');
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
                </div>
            </nav>

            <main className="main-content">
                <div className="edit-profile-container">
                    <h2>Edit Profile</h2>
                    {error && <div className="error-message">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="userName">Username</label>
                            <input
                                type="text"
                                id="userName"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save Changes'}
                            </button>
                            <Link
                                to="/"
                                className="cancel-btn"
                                onClick={(e) => isSubmitting && e.preventDefault()}
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="footer">
                <p>&copy; 2023 Library Management System. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default EditProfile;