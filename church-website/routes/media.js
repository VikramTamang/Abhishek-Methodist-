const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const verifyToken = require('../middleware/auth');

// Store uploads in /images folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../images');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) &&
              allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Only image files are allowed.'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// POST /api/media/upload — upload one image, returns its public URL
router.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });
  const url = `/images/${req.file.filename}`;
  res.json({ success: true, url, filename: req.file.filename });
});

// GET /api/media/list — list all images in /images
router.get('/list', verifyToken, (req, res) => {
  const dir = path.join(__dirname, '../images');
  const files = fs.readdirSync(dir)
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .map(f => ({ filename: f, url: `/images/${f}` }));
  res.json({ success: true, data: files });
});

// DELETE /api/media/:filename
router.delete('/:filename', verifyToken, (req, res) => {
  const filePath = path.join(__dirname, '../images', req.params.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: 'File deleted.' });
  } else {
    res.status(404).json({ success: false, message: 'File not found.' });
  }
});

module.exports = router;
