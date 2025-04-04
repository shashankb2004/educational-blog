import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [userBlogs, setUserBlogs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [blogCount, setBlogCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUserBlogs();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile information');
    }
  };

  const fetchUserBlogs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:5000/api/blogs/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Fetched blogs:', response.data); // Debug log
      setUserBlogs(response.data);
      setBlogCount(response.data.length);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', err); // Debug log
      setError(err.response?.data?.message || 'Failed to fetch your blogs');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mt-5 fade-in">
        <div className="alert alert-warning">
          Please log in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div className="card hover-lift scale-in">
            <div className="card-body text-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 scale-in"
                style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <h3 className="card-title">{user.username}</h3>
              <p className="text-muted">{user.email}</p>
              <div className="d-grid gap-2">
                <Link to="/change-password" className="btn btn-outline-primary hover-scale">
                  Change Password
                </Link>
              </div>
            </div>
          </div>

          <div className="card mt-3 slide-in">
            <div className="card-body">
              <h5 className="card-title">Quick Stats</h5>
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  Total Blogs
                  <span className="badge bg-primary rounded-pill hover-scale">
                    {blogCount}
                  </span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  Member Since
                  <span className="text-muted">
                    {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'Loading...'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card fade-in">
            <div className="card-header">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile Details
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'blogs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('blogs')}
                  >
                    My Blogs
                  </button>
                </li>
              </ul>
            </div>
            <div className="card-body">
              {activeTab === 'profile' ? (
                <div className="fade-in">
                  <h5 className="card-title">Profile Information</h5>
                  <div className="mb-3">
                    <label className="form-label text-muted">Username</label>
                    <p className="form-control">{user.username}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-muted">Email</label>
                    <p className="form-control">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="card-title mb-0">My Blogs</h5>
                    <Link to="/create-blog" className="btn btn-primary btn-sm hover-lift">
                      Create New Blog
                    </Link>
                  </div>
                  {loading ? (
                    <div className="text-center">
                      <div className="loading-spinner mx-auto"></div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger fade-in">{error}</div>
                  ) : userBlogs.length === 0 ? (
                    <div className="alert alert-info fade-in">
                      You haven't created any blogs yet.
                    </div>
                  ) : (
                    <div className="list-group stagger-children">
                      {userBlogs.map((blog) => (
                        <div key={blog._id} className="list-group-item hover-lift">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{blog.title}</h6>
                            <small className="text-muted">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                          <p className="mb-1 text-muted small">
                            {blog.excerpt || blog.content.substring(0, 100)}...
                          </p>
                          <div className="mt-2">
                            <span className="category-badge bg-light text-dark me-2">
                              {blog.category}
                            </span>
                            <Link
                              to={`/blogs/${blog._id}`}
                              className="btn btn-outline-primary btn-sm me-2 hover-lift"
                            >
                              View
                            </Link>
                            <Link
                              to={`/edit-blog/${blog._id}`}
                              className="btn btn-outline-secondary btn-sm hover-lift"
                            >
                              Edit
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 