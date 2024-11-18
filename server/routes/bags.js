const express = require('express');
const { BagModel } = require('../db');

const router = express.Router();

// Get all bags
router.get('/', (req, res) => {
  try {
    const bags = BagModel.listAll.all();
    res.json(bags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bags by brand
router.get('/brand/:brandId', (req, res) => {
  try {
    const bags = BagModel.listByBrand.all(req.params.brandId);
    res.json(bags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bag by ID
router.get('/:id', (req, res) => {
  try {
    const bag = BagModel.findById.get(req.params.id);
    if (!bag) {
      return res.status(404).json({ error: 'Bag not found' });
    }
    res.json(bag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create bag
router.post('/', (req, res) => {
  try {
    const { compatibility, securityFeatures, ...bagData } = req.body;
    const result = BagModel.create.run(bagData);
    const bagId = result.lastInsertRowid;
    
    // Add compatibility
    if (compatibility) {
      compatibility.forEach(bikeType => {
        BagModel.addCompatibility.run({ bagId, bikeType });
      });
    }
    
    // Add security features
    if (securityFeatures) {
      securityFeatures.forEach(feature => {
        BagModel.addSecurityFeature.run({ bagId, feature });
      });
    }
    
    res.status(201).json({ id: bagId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update bag
router.put('/:id', (req, res) => {
  try {
    const { compatibility, securityFeatures, ...bagData } = req.body;
    BagModel.updateById.run({ ...bagData, id: req.params.id });
    
    // Update compatibility
    if (compatibility) {
      BagModel.deleteCompatibility.run(req.params.id);
      compatibility.forEach(bikeType => {
        BagModel.addCompatibility.run({ bagId: req.params.id, bikeType });
      });
    }
    
    // Update security features
    if (securityFeatures) {
      BagModel.deleteSecurityFeatures.run(req.params.id);
      securityFeatures.forEach(feature => {
        BagModel.addSecurityFeature.run({ bagId: req.params.id, feature });
      });
    }
    
    res.json({ message: 'Bag updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete bag
router.delete('/:id', (req, res) => {
  try {
    BagModel.deleteById.run(req.params.id);
    res.json({ message: 'Bag deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;