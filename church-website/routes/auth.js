const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Only one authorised email
    if (!email || email.toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ success: false, message: 'Access denied. Unauthorised email address.' });
    }

    // Compare password
    const validPassword = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    // Issue JWT (24-hour expiry)
    const token = jwt.sign(
      { email: process.env.ADMIN_EMAIL, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: false,           // set true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'Lax'
    });

    res.json({ success: true, message: 'Login successful.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.', error: err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/check — used by frontend to verify session
router.get('/check', require('../middleware/auth'), (req, res) => {
  res.json({ success: true, admin: req.admin.email });
});

module.exports = router;
