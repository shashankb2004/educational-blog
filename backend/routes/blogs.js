const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user blogs (protected route)
router.get('/user', auth, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.userId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single blog
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username');
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create blog (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, content, excerpt, image } = req.body;

    // Validate required fields
    if (!title || !category || !content || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate category
    const validCategories = ['Technology', 'Science', 'Mathematics', 'History', 'Literature', 'Other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const blog = new Blog({
      title,
      category,
      content,
      excerpt: excerpt || content.substring(0, 150) + '...',
      image,
      author: req.user.userId
    });

    await blog.save();
    
    // Populate author details before sending response
    await blog.populate('author', 'username');
    res.status(201).json(blog);
  } catch (error) {
    console.error('Blog creation error:', error);
    res.status(500).json({ 
      message: 'Failed to create blog', 
      error: error.message 
    });
  }
});

// Update blog (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this blog' });
    }

    const { title, category, content, excerpt, image } = req.body;
    
    // Validate category if it's being updated
    if (category) {
      const validCategories = ['Technology', 'Science', 'Mathematics', 'History', 'Literature', 'Other'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
    }

    blog.title = title;
    blog.category = category;
    blog.content = content;
    blog.excerpt = excerpt || content.substring(0, 150) + '...';
    blog.image = image;

    await blog.save();
    await blog.populate('author', 'username');
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete blog (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 