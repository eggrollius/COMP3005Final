const express = require('express');
const router = express.Router();
const Member = require('../models/member');  

// POST route to create a new member
router.post('/members', async (req, res) => {
    console.log(req.body);  
    try {
        const { name, email, password, dob, fitness_goals, health_metrics } = req.body;
        if (!name) {
            return res.status(400).json({ error: "The 'name' field is required." });
        }
        const newMember = await Member.create(name, email, password, dob, fitness_goals, health_metrics);
        res.status(201).json(newMember);
    } catch (error) {
        console.error('Error adding new member:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST route to update a members info (correct email & pass required), empty fields not changed
router.post('/members/update', async (req, res) => {
    const { email, password,  newEmail, newName, newPassword, newDob, new_fitness_goals, new_health_metrics } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Current email is required for updates.' });
    }

    const updates = { newName, newEmail, newPassword, newdob, new_fitness_goals, new_health_metrics };

    try {
        const updatedMember = await Member.updateByEmail(email, updates, newEmail);
        if (updatedMember) {
            res.json({ success: true, member: updatedMember });
        } else {
            res.status(404).json({ success: false, message: "Member not found or no updates needed." });
        }
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ success: false, message: 'Failed to update member', error: error.message });
    }
});

module.exports = router;
