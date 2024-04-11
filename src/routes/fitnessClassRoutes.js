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

router.post('/update/:id', async (req, res) => {
  try {
    const updates = req.body;
    const result = await FitnessClass.update(req.params.id, updates);
    res.status(200).json({success: true, message:'Class Updated', class: result});
  } catch(error) {
    console.log('Error updateing class', error);
    res.status(500).json({success: false, message:'Error mupdating class'});
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const result = await FitnessClass.delete(req.params.id);
    res.status(200).json({success: true, message:'Class deleted'});
  } catch(error) {
    console.log('Error deleting class', error);
    res.status(500).json({success: false, message:'Error deletinbg class'});
  }
});

module.exports= router;