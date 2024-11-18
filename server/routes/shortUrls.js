import express from 'express';
import { ShortUrlModel } from '../db';

const router = express.Router();

// Resolve short URL
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const url = await ShortUrlModel.findByCode.get(shortCode);
    
    if (!url) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    res.json({ listingId: url.listingId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;