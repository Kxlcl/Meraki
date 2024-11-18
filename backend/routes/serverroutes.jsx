const express = require('express');
const router = express.Router();
const Business = require('../models/businessbackend');

// Create a new business
router.post('/', async (req, res) => {
    try {
        const { businessName, mainImage, description } = req.body;

        const newBusiness = new Business({
            businessName,
            mainImage,
            description,
        });

        await newBusiness.save();
        res.status(201).json(newBusiness);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all businesses
router.get('/', async (req, res) => {
    try {
        const businesses = await Business.find();
        res.status(200).json(businesses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
