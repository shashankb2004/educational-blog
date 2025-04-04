import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    title: '',
    category: '',
    content: '',
    image: '',
    excerpt: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error('API URL is not configured');
        }

        const response = await axios.get(`${apiUrl}/api/blogs/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setBlog(response.data);
        setFormData({
          title: response.data.title,
          content: response.data.content,
          category: response.data.category
        });
      } catch (err) {
        console.error('Error fetching blog:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Failed to fetch blog');
      }
    };

    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error('API URL is not configured');
      }

      await axios.put(`${apiUrl}/api/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error('Error updating blog:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      setError(err.response?.data?.message || 'Failed to update blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="loading-spinner mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card fade-in">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Edit Blog</h2>
              {error && <div className="alert alert-danger fade-in">{error}</div>}
              {success && <div className="alert alert-success fade-in">{success}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={blog.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={blog.category}
                    onChange={handleChange}
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
                    value={blog.image}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">Content</label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    value={blog.content}
                    onChange={handleChange}
                    rows="10"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="excerpt" className="form-label">Excerpt (optional)</label>
                  <textarea
                    className="form-control"
                    id="excerpt"
                    name="excerpt"
                    value={blog.excerpt}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary hover-lift">
                    Update Blog
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary hover-lift"
                    onClick={() => navigate('/blogs')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog; 