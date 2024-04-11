const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');  

router.post('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { type, status } = req.body;

  try {
    const updatedEquipment = await Equipment.update(id, type, status);
    res.status(200).json({
      message: 'Equipment updated successfully',
      data: updatedEquipment
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update equipment', error: error.message });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const deletedEquipment = await Equipment.deleteById(parseInt(id));
      res.json({
          success: true,
          message: 'Equipment deleted successfully',
          data: deletedEquipment
      });
  } catch (error) {
      console.error('Delete equipment error:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to delete equipment',
          error: error.message
      });
  }
});

// Route to add new equipment
router.post('/add', async (req, res) => {
  const { type, status } = req.body;
  if (!type || !status) {
      return res.status(400).json({
          success: false,
          message: "Missing required fields 'type' or 'status'"
      });
  }

  try {
      const newEquipment = await Equipment.create(type, status);
      res.json({
          success: true,
          message: 'New equipment added successfully',
          data: newEquipment
      });
  } catch (error) {
      console.error('Error adding new equipment:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to add new equipment',
          error: error.message
      });
  }
});

module.exports = router;