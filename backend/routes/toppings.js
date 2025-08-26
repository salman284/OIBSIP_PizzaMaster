const express = require('express');
const Topping = require('../models/Topping');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all toppings
// @route   GET /api/toppings
// @access  Public
const getAllToppings = async (req, res) => {
  try {
    const toppings = await Topping.find({ isActive: true }).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: toppings.length,
      data: toppings
    });
  } catch (error) {
    console.error('Get toppings error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching toppings'
    });
  }
};

// @desc    Get toppings by category
// @route   GET /api/toppings/category/:category
// @access  Public
const getToppingsByCategory = async (req, res) => {
  try {
    const toppings = await Topping.find({ 
      category: req.params.category,
      isActive: true 
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: toppings.length,
      data: toppings
    });
  } catch (error) {
    console.error('Get toppings by category error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching toppings by category'
    });
  }
};

// @desc    Get single topping
// @route   GET /api/toppings/:id
// @access  Public
const getTopping = async (req, res) => {
  try {
    const topping = await Topping.findById(req.params.id);

    if (!topping) {
      return res.status(404).json({
        success: false,
        error: 'Topping not found'
      });
    }

    res.status(200).json({
      success: true,
      data: topping
    });
  } catch (error) {
    console.error('Get topping error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching topping'
    });
  }
};

// @desc    Create topping
// @route   POST /api/toppings
// @access  Private/Admin
const createTopping = async (req, res) => {
  try {
    const topping = await Topping.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Topping created successfully',
      data: topping
    });
  } catch (error) {
    console.error('Create topping error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating topping'
    });
  }
};

// @desc    Update topping
// @route   PUT /api/toppings/:id
// @access  Private/Admin
const updateTopping = async (req, res) => {
  try {
    const topping = await Topping.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!topping) {
      return res.status(404).json({
        success: false,
        error: 'Topping not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Topping updated successfully',
      data: topping
    });
  } catch (error) {
    console.error('Update topping error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating topping'
    });
  }
};

// @desc    Delete topping
// @route   DELETE /api/toppings/:id
// @access  Private/Admin
const deleteTopping = async (req, res) => {
  try {
    const topping = await Topping.findById(req.params.id);

    if (!topping) {
      return res.status(404).json({
        success: false,
        error: 'Topping not found'
      });
    }

    await topping.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Topping deleted successfully'
    });
  } catch (error) {
    console.error('Delete topping error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting topping'
    });
  }
};

// @desc    Update topping stock
// @route   PUT /api/toppings/:id/stock
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

    const topping = await Topping.findById(req.params.id);

    if (!topping) {
      return res.status(404).json({
        success: false,
        error: 'Topping not found'
      });
    }

    if (operation === 'add') {
      topping.stockQuantity += quantity;
    } else if (operation === 'subtract') {
      if (topping.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock'
        });
      }
      topping.stockQuantity -= quantity;
    }

    await topping.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: topping
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
  .get(getAllToppings)
  .post(protect, authorize('admin'), createTopping);

router.get('/category/:category', getToppingsByCategory);

router.route('/:id')
  .get(getTopping)
  .put(protect, authorize('admin'), updateTopping)
  .delete(protect, authorize('admin'), deleteTopping);

router.put('/:id/stock', protect, authorize('admin'), updateStock);

module.exports = router;
