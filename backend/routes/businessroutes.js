// routes/businessRoutes.js
const express = require('express');
const Business = require('../models/businessbackend');  // Ensure this is your correct model path
const router = express.Router();

// Fetch a business by ID
router.get('/businesses/:id', async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);  // Find business by ID
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
