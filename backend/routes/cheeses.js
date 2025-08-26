const express = require('express');
const Cheese = require('../models/Cheese');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all cheeses
// @route   GET /api/cheeses
// @access  Public
const getAllCheeses = async (req, res) => {
  try {
    const cheeses = await Cheese.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cheeses.length,
      data: cheeses
    });
  } catch (error) {
    console.error('Get cheeses error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching cheeses'
    });
  }
};

// @desc    Get single cheese
// @route   GET /api/cheeses/:id
// @access  Public
const getCheese = async (req, res) => {
  try {
    const cheese = await Cheese.findById(req.params.id);

    if (!cheese) {
      return res.status(404).json({
        success: false,
        error: 'Cheese not found'
      });
    }

    res.status(200).json({
      success: true,
      data: cheese
    });
  } catch (error) {
    console.error('Get cheese error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching cheese'
    });
  }
};

// @desc    Create cheese
// @route   POST /api/cheeses
// @access  Private/Admin
const createCheese = async (req, res) => {
  try {
    const cheese = await Cheese.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Cheese created successfully',
      data: cheese
    });
  } catch (error) {
    console.error('Create cheese error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating cheese'
    });
  }
};

// @desc    Update cheese
// @route   PUT /api/cheeses/:id
// @access  Private/Admin
const updateCheese = async (req, res) => {
  try {
    const cheese = await Cheese.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!cheese) {
      return res.status(404).json({
        success: false,
        error: 'Cheese not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cheese updated successfully',
      data: cheese
    });
  } catch (error) {
    console.error('Update cheese error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating cheese'
    });
  }
};

// @desc    Delete cheese
// @route   DELETE /api/cheeses/:id
// @access  Private/Admin
const deleteCheese = async (req, res) => {
  try {
    const cheese = await Cheese.findById(req.params.id);

    if (!cheese) {
      return res.status(404).json({
        success: false,
        error: 'Cheese not found'
      });
    }

    await cheese.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Cheese deleted successfully'
    });
  } catch (error) {
    console.error('Delete cheese error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting cheese'
    });
  }
};

// @desc    Update cheese stock
// @route   PUT /api/cheeses/:id/stock
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

    const cheese = await Cheese.findById(req.params.id);

    if (!cheese) {
      return res.status(404).json({
        success: false,
        error: 'Cheese not found'
      });
    }

    if (operation === 'add') {
      cheese.stockQuantity += quantity;
    } else if (operation === 'subtract') {
      if (cheese.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock'
        });
      }
      cheese.stockQuantity -= quantity;
    }

    await cheese.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: cheese
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
  .get(getAllCheeses)
  .post(protect, authorize('admin'), createCheese);

router.route('/:id')
  .get(getCheese)
  .put(protect, authorize('admin'), updateCheese)
  .delete(protect, authorize('admin'), deleteCheese);

router.put('/:id/stock', protect, authorize('admin'), updateStock);

module.exports = router;
