const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    businessName: { type: String, required: true },
    mainImage: { type: String }, // Save image path or URL
    description: { type: String, required: true },
});

module.exports = mongoose.model('Business', businessSchema);
