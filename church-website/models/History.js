const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  year: { type: String, required: true },
  tag: { type: String, default: '' },
  title: { type: String, required: true },
  pullQuote: { type: String, default: '' },
  description1: { type: String, default: '' },
  description2: { type: String, default: '' },
  facts: [{ icon: String, text: String }],
  image: { type: String, default: '' },
  artBackground: { type: String, default: '' },
  artIcon: { type: String, default: '' },
  artText: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('History', HistorySchema);
