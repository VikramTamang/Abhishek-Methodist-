const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  address: { type: String, default: 'Abhisek Methodist Church, Main Road, Central District' },
  phone: { type: String, default: '+91-98765-43210' },
  email: { type: String, default: 'info@abhisekmethodistchurch.org' },
  serviceTime: { type: String, default: 'Every Saturday, 10:00 AM' },
  mapUrl: { type: String, default: '' },
  facebook: { type: String, default: '#' },
  youtube: { type: String, default: '#' },
  instagram: { type: String, default: '#' },
  whatsapp: { type: String, default: '#' },
}, { timestamps: true });

module.exports = mongoose.model('Contact', ContactSchema);
