const express = require('express');
const { BrandModel } = require('../db');

const router = express.Router();

// Get all brands
router.get('/', (req, res) => {
  try {
    const brands = BrandModel.listAll.all();
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get brand by ID
router.get('/:id', (req, res) => {
  try {
    const brand = BrandModel.findById.get(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create brand
router.post('/', (req, res) => {
  try {
    const result = BrandModel.create.run(req.body);
    const brandId = result.lastInsertRowid;
    
    // Add specialties
    if (req.body.specialties) {
      req.body.specialties.forEach(specialty => {
        BrandModel.addSpecialty.run({ brandId, specialty });
      });
    }
    
    res.status(201).json({ id: brandId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update brand
router.put('/:id', (req, res) => {
  try {
    const { specialties, ...brandData } = req.body;
    BrandModel.updateById.run({ ...brandData, id: req.params.id });
    
    // Update specialties
    if (specialties) {
      BrandModel.deleteSpecialties.run(req.params.id);
      specialties.forEach(specialty => {
        BrandModel.addSpecialty.run({ brandId: req.params.id, specialty });
      });
    }
    
    res.json({ message: 'Brand updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete brand
router.delete('/:id', (req, res) => {
  try {
    BrandModel.deleteById.run(req.params.id);
    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;