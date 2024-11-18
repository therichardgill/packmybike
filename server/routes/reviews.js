const express = require('express');
const { ReviewModel, ListingModel } = require('../db');

const router = express.Router();

// Get reviews by listing with pagination
router.get('/listing/:listingId', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const reviews = await ReviewModel.listByListing.all({
      listingId: req.params.listingId,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create review
router.post('/', async (req, res) => {
  try {
    const { listingId, reviewerId, rating, comment } = req.body;
    
    // Check if user has already reviewed this listing
    const existingReview = await ReviewModel.findByListingAndReviewer.get({
      listingId,
      reviewerId
    });
    
    if (existingReview) {
      return res.status(400).json({
        error: 'You have already reviewed this listing'
      });
    }
    
    const result = await ReviewModel.create.run({
      listingId,
      reviewerId,
      rating,
      comment,
      createdAt: Date.now()
    });
    
    // Update listing rating and review count
    await ListingModel.updateRating.run({ listingId });
    
    res.status(201).json({ id: result.lastID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    const review = await ReviewModel.findById.get(req.params.id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    // Only allow reviewer or admin to delete
    if (req.user.id !== review.reviewerId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await ReviewModel.deleteById.run(req.params.id);
    
    // Update listing rating and review count
    await ListingModel.updateRating.run({ listingId: review.listingId });
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;