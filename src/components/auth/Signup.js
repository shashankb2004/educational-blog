import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    setError('');
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation checks
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('All fields are required');
        setLoading(false);
        return;
      }

      if (formData.username.length < 3) {
        setError('Username must be at least 3 characters long');
        setLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      console.log('Attempting to sign up with:', {
        username: formData.username,
        email: formData.email,
        apiUrl: process.env.REACT_APP_API_URL
      });

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      console.log('Signup response:', response.data);

      if (response.data.token && response.data.user) {
        login(response.data);
        navigate('/');
      }
    } catch (error) {
      console.error('Signup error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.message || 'Failed to create account');
      } else if (error.request) {
        // The request was made but no response was received
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Sign Up</h2>
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    minLength="3"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={togglePassword}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={toggleConfirmPassword}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 