const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Update user photo
router.post('/update-photo', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Photo update route is removed',
      photo: user.photo
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 