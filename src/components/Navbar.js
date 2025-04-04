import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignInAlt, faSignOutAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-3" to="/" style={{ color: '#0d6efd' }}>
          EduBlog
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs">
                Blogs
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            {user ? (
              <>
                <Link to="/create-blog" className="btn btn-success me-2">
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  Create Blog
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-danger">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  <FontAwesomeIcon icon={faSignInAlt} className="me-1" />
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  <FontAwesomeIcon icon={faUser} className="me-1" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 