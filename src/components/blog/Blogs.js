import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedBlog, setEditedBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      console.log('Fetching blogs from:', apiUrl);
      const response = await axios.get(`${apiUrl}/api/blogs`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setBlogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blogs:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to fetch blogs');
      setLoading(false);
    }
  };

  const handleReadMore = async (blogId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      const response = await axios.get(`${apiUrl}/api/blogs/${blogId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setSelectedBlog(response.data);
      setEditMode(false);
    } catch (err) {
      console.error('Error fetching blog details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError('Failed to fetch blog details');
    }
  };

  const handleEdit = (blog) => {
    setEditedBlog({
      ...blog,
      title: blog.title,
      category: blog.category,
      content: blog.content,
      image: blog.image
    });
    setEditMode(true);
    setSelectedBlog(blog);
  };

  const handleEditChange = (e) => {
    setEditedBlog({
      ...editedBlog,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      await axios.put(`${apiUrl}/api/blogs/${editedBlog._id}`, editedBlog, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const updatedBlog = await axios.get(`${apiUrl}/api/blogs/${editedBlog._id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setEditMode(false);
      fetchBlogs();
      setSelectedBlog(updatedBlog.data);
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('Failed to update blog');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 page-transition">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 page-transition">
        <div className="alert alert-danger fade-in">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5 page-transition">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fade-in">Latest Blogs</h2>
        {user && (
          <Link to="/create-blog" className="btn btn-primary hover-lift">
            Create New Blog
          </Link>
        )}
      </div>

      {selectedBlog ? (
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card">
              {editMode ? (
                <div className="card-body">
                  <h2 className="mb-4">Edit Blog</h2>
                  <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                      <label htmlFor="title" className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={editedBlog.title}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="category" className="form-label">Category</label>
                      <select
                        className="form-select"
                        id="category"
                        name="category"
                        value={editedBlog.category}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="">Select a category</option>
                        <option value="Technology">Technology</option>
                        <option value="Science">Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="History">History</option>
                        <option value="Literature">Literature</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">Image URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="image"
                        name="image"
                        value={editedBlog.image}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">Content</label>
                      <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        value={editedBlog.content}
                        onChange={handleEditChange}
                        required
                        rows="10"
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <>
                  {selectedBlog.image && (
                    <img
                      src={selectedBlog.image}
                      className="card-img-top"
                      alt={selectedBlog.title}
                      style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                  )}
                  <div className="card-body">
                    <h2 className="card-title">{selectedBlog.title}</h2>
                    <div className="text-muted mb-3">
                      <small>
                        By {selectedBlog.author.username} • {new Date(selectedBlog.createdAt).toLocaleDateString()} • 
                        Category: {selectedBlog.category}
                      </small>
                    </div>
                    <div className="card-text" style={{ whiteSpace: 'pre-line' }}>
                      {selectedBlog.content}
                    </div>
                    <div className="mt-3">
                      <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => setSelectedBlog(null)}
                      >
                        Back to Blogs
                      </button>
                      {user && user.id === selectedBlog.author._id && (
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleEdit(selectedBlog)}
                        >
                          Edit Blog
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          {blogs.length === 0 ? (
            <div className="alert alert-info fade-in">No blogs available.</div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 stagger-children">
              {blogs.map((blog) => (
                <div key={blog._id} className="col">
                  <div className="card h-100 hover-lift">
                    <img
                      src={blog.image}
                      className="card-img-top"
                      alt={blog.title}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title mb-0">{blog.title}</h5>
                        <span className="category-badge bg-light text-dark">
                          {blog.category}
                        </span>
                      </div>
                      <p className="card-text text-muted small">
                        {blog.excerpt || blog.content.substring(0, 150)}...
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <small className="text-muted">
                          By {blog.author.username} <br />
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </small>
                        <Link
                          to={`/blogs/${blog._id}`}
                          className="btn btn-outline-primary btn-sm hover-scale"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Blogs; 