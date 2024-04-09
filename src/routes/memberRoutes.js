const express = require('express');
const router = express.Router();
const Member = require('../models/member');  

// POST route to create a new member
router.post('/', async (req, res) => {
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
router.post('/update', async (req, res) => {
    const { email, password,  newEmail, newName, newPassword, newDob, new_fitness_goals, new_health_metrics } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Current email is required for updates.' });
    }

    const updates = { 
            "name": newName,
            "email": newEmail, 
            "password": newPassword, 
            "dob": newDob, 
            "fitness_goals": JSON.parse(new_fitness_goals), 
            "health_metrics": JSON.parse(new_health_metrics) 
    };

    try {
        const updatedMember = await Member.updateByEmail(email, password, updates);
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

router.post('/book-session', async (req, res) => {
    const { email, password, trainerId, sessionDate, startTime, endTime } = req.body;

    try {
        if (!email || !password || !trainerId || !sessionDate || !startTime || !endTime) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const start = new Date(`${sessionDate}T${startTime}:00.000Z`);
        const end = new Date(`${sessionDate}T${endTime}:00.000Z`);
        
        if (start >= end) {
            return res.status(400).json({ success: false, message: 'Invalid time range' });
        }

        // Convert dates to ISO string without timezone conversion
        const startIso = start.toISOString().replace('Z', '');
        const endIso = end.toISOString().replace('Z', '');

        // Schedule the training session
        const session = await Member.scheduleTrainingSession(email, password, trainerId, startIso, endIso);
        res.status(201).json({ success: true, session });
    } catch (error) {
        console.error('Error booking session:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});

router.post('/join-class', async (req, res) => {
    const { email, password, classId } = req.body;

    try {
        const memberId = await Member.authenticate(email, password);
        if (!memberId) {
            return res.status(401).json({ success: false, message: 'Authentication failed' });
        }
        const result = await Member.enrollInClass(memberId, classId);
        res.json({ success: true, message: 'Enrolled in class successfully', details: result });
    } catch (error) {
        console.error('Error joining class:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
});
    
router.get('/search', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ success: false, message: "Name parameter is required." });
    }

    const result = await Member.searchMembersByName(name);
    if (result.success) {
        res.json(result);
    } else {
        res.status(500).json(result);
    }
});
  


module.exports = router;
