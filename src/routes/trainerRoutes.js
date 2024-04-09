const express = require('express');
const router = express.Router();

const Trainer = require('../models/trainer');

// Login a trainer
router.post('/login', async (req, res) => {
    const { trainerId, password } = req.body;
    try {
        const authenticated = await Trainer.authenticate(trainerId, password);
        if (!authenticated) {
            return res.status(401).json({ success: false, message: "Authentication failed" });
        }
        res.json({ success: true, message: "Authenticated successfully", trainerId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Add availability
router.post('/add-availability', async (req, res) => {
    const { trainerId, availableFrom, availableTo } = req.body;
    try {
        const availability = await Trainer.addAvailability(trainerId, availableFrom, availableTo);
        res.json({ success: true, message: "Availability added", availability });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Remove availability
router.delete('/remove-availability', async (req, res) => {
    const { availabilityId } = req.query;
    try {
        const removed = await Trainer.removeAvailability(availabilityId);
        res.json({ success: true, message: "Availability removed", removed });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

// Get availability
router.get('/availability', async (req, res) => {
    const { trainerId } = req.query;
    try {
        const availabilities = await Trainer.fetchAvailability(trainerId);
        res.json({ success: true, availabilities });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});


module.exports = router;
