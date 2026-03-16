const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const SiteContent = require('../models/SiteContent');
const History = require('../models/History');
const Branch = require('../models/Branch');
const Testimony = require('../models/Testimony');
const Contact = require('../models/Contact');

// ─── SITE CONTENT (Homepage + About) ─────────────────────────────────────────
router.get('/content', async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = await SiteContent.create({});
    res.json({ success: true, data: content });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.put('/content', verifyToken, async (req, res) => {
  try {
    let content = await SiteContent.findOne();
    if (!content) content = new SiteContent();
    Object.assign(content, req.body);
    await content.save();
    res.json({ success: true, data: content });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ─── HISTORY ──────────────────────────────────────────────────────────────────
router.get('/history', async (req, res) => {
  try {
    const items = await History.find().sort({ order: 1, year: 1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/history', verifyToken, async (req, res) => {
  try {
    const item = await History.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.put('/history/:id', verifyToken, async (req, res) => {
  try {
    const item = await History.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.delete('/history/:id', verifyToken, async (req, res) => {
  try {
    await History.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'History item deleted.' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ─── BRANCHES ────────────────────────────────────────────────────────────────
router.get('/branches', async (req, res) => {
  try {
    const items = await Branch.find().sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/branches', verifyToken, async (req, res) => {
  try {
    const item = await Branch.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.put('/branches/:id', verifyToken, async (req, res) => {
  try {
    const item = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.delete('/branches/:id', verifyToken, async (req, res) => {
  try {
    await Branch.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Branch deleted.' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ─── TESTIMONIES ─────────────────────────────────────────────────────────────
router.get('/testimonies', async (req, res) => {
  try {
    const items = await Testimony.find().sort({ order: 1 });
    res.json({ success: true, data: items });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/testimonies', verifyToken, async (req, res) => {
  try {
    const item = await Testimony.create(req.body);
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.put('/testimonies/:id', verifyToken, async (req, res) => {
  try {
    const item = await Testimony.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: item });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.delete('/testimonies/:id', verifyToken, async (req, res) => {
  try {
    await Testimony.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Testimony deleted.' });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

// ─── CONTACT ─────────────────────────────────────────────────────────────────
router.get('/contact', async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) contact = await Contact.create({});
    res.json({ success: true, data: contact });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.put('/contact', verifyToken, async (req, res) => {
  try {
    let contact = await Contact.findOne();
    if (!contact) contact = new Contact();
    Object.assign(contact, req.body);
    await contact.save();
    res.json({ success: true, data: contact });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
