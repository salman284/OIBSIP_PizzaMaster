const express = require('express');
const Sauce = require('../models/Sauce');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all sauces
// @route   GET /api/sauces
// @access  Public
const getAllSauces = async (req, res) => {
  try {
    const sauces = await Sauce.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: sauces.length,
      data: sauces
    });
  } catch (error) {
    console.error('Get sauces error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching sauces'
    });
  }
};

// @desc    Get single sauce
// @route   GET /api/sauces/:id
// @access  Public
const getSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findById(req.params.id);

    if (!sauce) {
      return res.status(404).json({
        success: false,
        error: 'Sauce not found'
      });
    }

    res.status(200).json({
      success: true,
      data: sauce
    });
  } catch (error) {
    console.error('Get sauce error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching sauce'
    });
  }
};

// @desc    Create sauce
// @route   POST /api/sauces
// @access  Private/Admin
const createSauce = async (req, res) => {
  try {
    const sauce = await Sauce.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Sauce created successfully',
      data: sauce
    });
  } catch (error) {
    console.error('Create sauce error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating sauce'
    });
  }
};

// @desc    Update sauce
// @route   PUT /api/sauces/:id
// @access  Private/Admin
const updateSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!sauce) {
      return res.status(404).json({
        success: false,
        error: 'Sauce not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Sauce updated successfully',
      data: sauce
    });
  } catch (error) {
    console.error('Update sauce error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating sauce'
    });
  }
};

// @desc    Delete sauce
// @route   DELETE /api/sauces/:id
// @access  Private/Admin
const deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findById(req.params.id);

    if (!sauce) {
      return res.status(404).json({
        success: false,
        error: 'Sauce not found'
      });
    }

    await sauce.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sauce deleted successfully'
    });
  } catch (error) {
    console.error('Delete sauce error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting sauce'
    });
  }
};

// @desc    Update sauce stock
// @route   PUT /api/sauces/:id/stock
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

    const sauce = await Sauce.findById(req.params.id);

    if (!sauce) {
      return res.status(404).json({
        success: false,
        error: 'Sauce not found'
      });
    }

    if (operation === 'add') {
      sauce.stockQuantity += quantity;
    } else if (operation === 'subtract') {
      if (sauce.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock'
        });
      }
      sauce.stockQuantity -= quantity;
    }

    await sauce.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: sauce
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating stock'
    });
  }
};

// Routes
router.route('/')
  .get(getAllSauces)
  .post(protect, authorize('admin'), createSauce);

router.route('/:id')
  .get(getSauce)
  .put(protect, authorize('admin'), updateSauce)
  .delete(protect, authorize('admin'), deleteSauce);

router.put('/:id/stock', protect, authorize('admin'), updateStock);

module.exports = router;
