const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  tag: { type: String, default: 'Branch' },
  name: { type: String, required: true },
  location: { type: String, default: '' },
  schedule: { type: String, default: 'Every Saturday, 10:00 AM' },
  phone: { type: String, default: '' },
  image: { type: String, default: '' },
  colorClass: { type: String, default: 'branch-blue' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);
