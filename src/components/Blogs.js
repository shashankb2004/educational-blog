import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch blogs');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center mb-4 display-4 fw-bold">All Blogs</h1>
          <p className="text-center lead mb-5">
            Explore educational content from our community of writers.
          </p>
        </div>
      </div>
      
      <div className="row">
        {blogs.map(blog => (
          <div key={blog._id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="position-relative">
                <img 
                  src={blog.image} 
                  className="card-img-top" 
                  alt={blog.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-primary">{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="card-body">
                <h5 className="card-title fw-bold">{blog.title}</h5>
                <p className="card-text text-muted">{blog.excerpt}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    By <span className="fw-semibold">{blog.author.username}</span>
                  </small>
                  <Link to={`/blog/${blog._id}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs; 