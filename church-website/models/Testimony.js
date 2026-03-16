const mongoose = require('mongoose');

const TestimonySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Member' },
  message: { type: String, required: true },
  initial: { type: String, default: 'M' },
  avatarColor: { type: String, default: 'linear-gradient(135deg, #1a56db, #3b82f6)' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Testimony', TestimonySchema);
