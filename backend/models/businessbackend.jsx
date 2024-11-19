// backend/models/business.js
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  businessName: {
    type: String,
    required: true
  },
  mainImage: {
    type: String,  // Path or URL to the image
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);
module.exports = Business;
