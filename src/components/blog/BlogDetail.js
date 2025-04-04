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
      const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
      setBlog(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch blog');
      setLoading(false);
      console.error('Error fetching blog:', err);
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
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">Blog not found</div>
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