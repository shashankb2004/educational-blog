import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      console.log('Fetching blog with ID:', id);
      console.log('API URL:', apiUrl);
      
      const response = await axios.get(`${apiUrl}/api/blogs/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Blog fetch response:', response.data);
      setBlog(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blog:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: {
          url: err.config?.url,
          method: err.config?.method
        }
      });
      
      if (err.response) {
        setError(err.response.data.message || 'Failed to fetch blog');
      } else if (err.request) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <Link to="/blogs" className="btn btn-outline-primary">
              Back to Blogs
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">
          <h4 className="alert-heading">Blog Not Found</h4>
          <p>The blog you're looking for doesn't exist or has been removed.</p>
          <hr />
          <p className="mb-0">
            <Link to="/blogs" className="btn btn-outline-primary">
              Back to Blogs
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            {blog.image && (
              <img
                src={blog.image}
                className="card-img-top"
                alt={blog.title}
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            )}
            <div className="card-body">
              <h1 className="card-title">{blog.title}</h1>
              <div className="text-muted mb-3">
                <small>
                  By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()} • 
                  Category: {blog.category}
                </small>
              </div>
              <div className="card-text" style={{ whiteSpace: 'pre-line' }}>
                {blog.content}
              </div>
              <div className="mt-4">
                <Link to="/blogs" className="btn btn-outline-primary me-2">
                  Back to Blogs
                </Link>
                {user && user.id === blog.author._id && (
                  <Link to={`/edit-blog/${blog._id}`} className="btn btn-outline-secondary">
                    Edit Blog
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail; 