const express = require('express');
const { ListingModel } = require('../db');

const router = express.Router();

// Get all listings
router.get('/', (req, res) => {
  try {
    const listings = ListingModel.listAll.all();
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured listings
router.get('/featured', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const listings = ListingModel.listFeatured.all(limit);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search listings by location
router.get('/search', (req, res) => {
  try {
    const { location } = req.query;
    const searchTerm = `%${location}%`;
    const listings = ListingModel.searchByLocation.all(searchTerm);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get listings by user
router.get('/user/:userId', (req, res) => {
  try {
    const listings = ListingModel.listByUser.all(req.params.userId);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get listing by ID
router.get('/:id', (req, res) => {
  try {
    const listing = ListingModel.findById.get(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create listing
router.post('/', (req, res) => {
  try {
    const result = ListingModel.create.run(req.body);
    res.status(201).json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update listing
router.put('/:id', (req, res) => {
  try {
    ListingModel.updateById.run({ ...req.body, id: req.params.id });
    res.json({ message: 'Listing updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete listing
router.delete('/:id', (req, res) => {
  try {
    ListingModel.deleteById.run(req.params.id);
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;