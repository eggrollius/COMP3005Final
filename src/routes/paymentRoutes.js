const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

router.delete('/:id', async (req, res) => {
  try {
      const { id } = req.params; // Extract the ID from the request parameters
      const payment = await Payment.delete(parseInt(id));
      res.status(200).json({
          success: true,
          message: 'Payment deleted successfully',
          data: payment // Send back the deleted payment object
      });
  } catch (error) {
      if (error.message === 'Payment not found or already deleted') {
          res.status(404).json({
              success: false,
              message: 'Payment not found or already deleted'
          });
      } else {
          console.error('Error deleting payment:', error);
          res.status(500).json({
              success: false,
              message: 'Failed to delete payment',
              error: error.message
          });
      }
  }
});

module.exports = router;