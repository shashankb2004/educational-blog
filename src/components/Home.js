import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchFeaturedBlogs();
  }, []);

  const fetchFeaturedBlogs = async () => {
    try {
      console.log('Fetching blogs from:', process.env.REACT_APP_API_URL);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blogs`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      // Get the latest 3 blogs for showcase
      setFeaturedBlogs(response.data.slice(0, 3));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">Welcome to EduBlog</h1>
              <p className="lead">
                Share your knowledge, learn from others, and be part of our growing educational community.
              </p>
              <div className="mt-4">
                {!user && (
                  <Link to="/signup" className="btn btn-light btn-lg me-3">
                    Get Started
                  </Link>
                )}
                <Link to="/blogs" className="btn btn-outline-light btn-lg">
                  Browse Blogs
                </Link>
              </div>
            </div>
            <div className="col-md-6">
              <img
                src="https://img.freepik.com/free-vector/blogging-fun-content-creation-online-streaming-video-blog-young-girl-making-selfie-social-network-sharing-feedback-self-promotion-strategy_335657-2386.jpg"
                alt="Blog Illustration"
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Blogs Section */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Featured Blogs</h2>
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {featuredBlogs.map((blog) => (
              <div key={blog._id} className="col">
                <div className="card h-100 shadow-sm">
                  {blog.image && (
                    <img
                      src={blog.image}
                      className="card-img-top"
                      alt={blog.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Blog+Image';
                      }}
                    />
                  )}
                  <div className="card-body">
                    <h5 className="card-title">{blog.title}</h5>
                    <p className="card-text text-muted small">
                      By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                    <p className="card-text">
                      {blog.excerpt || blog.content.substring(0, 100)}...
                    </p>
                    <Link to={`/blogs/${blog._id}`} className="btn btn-outline-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/blogs" className="btn btn-primary btn-lg">
            View All Blogs
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-light py-5">
        <div className="container">
          <h2 className="text-center mb-4">Why Choose EduBlog?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-pencil-square fs-1 text-primary mb-3"></i>
                <h3>Easy to Use</h3>
                <p>Create and share your educational content with our user-friendly interface.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-people fs-1 text-primary mb-3"></i>
                <h3>Community Driven</h3>
                <p>Connect with other educators and learners from around the world.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <i className="bi bi-book fs-1 text-primary mb-3"></i>
                <h3>Quality Content</h3>
                <p>Access high-quality educational content across various subjects.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 