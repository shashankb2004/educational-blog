import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navbarTogglerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle dropdown menu
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }

      // Handle mobile menu
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        !navbarTogglerRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light shadow-sm" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'background-color 0.3s ease'
    }}>
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center">
            <Link className="navbar-brand fw-bold" to="/">
              EduBlog
            </Link>

            {/* Navigation Links */}
            <div className="d-none d-lg-flex">
              <ul className="navbar-nav">
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
            </div>
          </div>

          <div className="d-flex align-items-center">
            {/* Desktop Auth Buttons */}
            <div className="d-none d-lg-flex align-items-center me-5">
              {!user ? (
                <div className="d-flex gap-2">
                  <Link to="/login">
                    <button className="btn btn-outline-primary">Login</button>
                  </Link>
                  <Link to="/signup">
                    <button className="btn btn-primary">Sign Up</button>
                  </Link>
                </div>
              ) : (
                <div className="dropdown" ref={dropdownRef}>
                  <button
                    className="btn d-flex align-items-center gap-2"
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ border: 'none', background: 'none' }}
                  >
                    <div
                      className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '35px', 
                        height: '35px', 
                        fontSize: '1.1rem',
                        marginRight: '8px'
                      }}
                    >
                      {user && user.username ? user.username[0].toUpperCase() : ''}
                    </div>
                    <span className="d-none d-lg-inline ms-2">
                      {user?.username}
                    </span>
                  </button>
                  <ul className={`dropdown-menu dropdown-menu-end ${isOpen ? 'show' : ''}`}>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/profile" 
                        onClick={() => setIsOpen(false)}
                      >
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        className="dropdown-item" 
                        to="/change-password"
                        onClick={() => setIsOpen(false)}
                      >
                        Change Password
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Hamburger button */}
            <button
              ref={navbarTogglerRef}
              className="navbar-toggler ms-2"
              type="button"
              onClick={toggleMobileMenu}
              aria-controls="navbarNav"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`collapse navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} 
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>
                Blogs
              </Link>
            </li>
          </ul>

          {/* Mobile Auth Buttons */}
          <div className="d-lg-none mt-2">
            {!user ? (
              <div className="d-flex gap-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="btn btn-outline-primary">Login</button>
                </Link>
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="btn btn-primary">Sign Up</button>
                </Link>
              </div>
            ) : (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2"
                  onClick={() => setIsOpen(!isOpen)}
                  style={{ border: 'none' }}
                >
                  <div
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ 
                      width: '35px', 
                      height: '35px', 
                      fontSize: '1.1rem'
                    }}
                  >
                    {user && user.username ? user.username[0].toUpperCase() : ''}
                  </div>
                  <span>{user?.username}</span>
                </button>
                <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/profile" 
                      onClick={() => {
                        setIsOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to="/change-password"
                      onClick={() => {
                        setIsOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      Change Password
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item text-danger" 
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 