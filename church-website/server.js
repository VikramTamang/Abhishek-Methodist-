require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Static Files ─────────────────────────────────────────────────────────────
// Serve the main church website (HTML/CSS/JS/images)
app.use(express.static(path.join(__dirname)));
// Serve admin panel at /admin
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api', require('./routes/content'));
app.use('/api/media', require('./routes/media'));

// ─── SPA Fallback for Admin ───────────────────────────────────────────────────
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});
app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'dashboard.html'));
});

// ─── MongoDB + Server Start ───────────────────────────────────────────────────
async function start() {
  try {
    // Pre-hash admin password on startup (so .env keeps plain text for easy editing)
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    process.env.ADMIN_PASSWORD_HASH = hash;

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`🔐 Admin panel at   http://localhost:${PORT}/admin`);
      console.log(`📧 Admin email:     ${process.env.ADMIN_EMAIL}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
