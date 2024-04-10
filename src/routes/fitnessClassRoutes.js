const express = require('express');
const router = express.Router();
const Member = require('../models/member');  
const FitnessClass = require('../models/fitnessClass');


router.post('/', async (req, res) => {
  try {
    const { name, room_id, trainer_id, start_time, end_time, capacity, admin_id } = req.body;
    const result = await FitnessClass.create( name, room_id, trainer_id, start_time, end_time, capacity, admin_id );
    res.status(201).json({ success: true, message: 'Class Created', class: result });
  } catch (error) {
    console.log('Error making class', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports= router;