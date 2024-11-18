const express = require('express');
const { BookingModel } = require('../db');

const router = express.Router();

// Get bookings by listing
router.get('/listing/:listingId', (req, res) => {
  try {
    const bookings = BookingModel.listByListing.all(req.params.listingId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bookings by user
router.get('/user/:userId', (req, res) => {
  try {
    const bookings = BookingModel.listByUser.all(req.params.userId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check listing availability
router.get('/check-availability/:listingId', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = BookingModel.checkAvailability.get({
      listingId: req.params.listingId,
      startDate: parseInt(startDate),
      endDate: parseInt(endDate),
    });
    res.json({ available: result.count === 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', (req, res) => {
  try {
    const booking = BookingModel.findById.get(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create booking
router.post('/', (req, res) => {
  try {
    // Check availability first
    const availability = BookingModel.checkAvailability.get({
      listingId: req.body.listingId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });
    
    if (availability.count > 0) {
      return res.status(400).json({ error: 'Listing is not available for these dates' });
    }
    
    const result = BookingModel.create.run(req.body);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update booking status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    BookingModel.updateStatus.run({
      id: req.params.id,
      status,
      updatedAt: Date.now(),
    });
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete booking
router.delete('/:id', (req, res) => {
  try {
    BookingModel.deleteById.run(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;