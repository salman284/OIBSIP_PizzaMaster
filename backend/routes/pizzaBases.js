const express = require('express');
const PizzaBase = require('../models/PizzaBase');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all pizza bases
// @route   GET /api/pizza-bases
// @access  Public
const getAllPizzaBases = async (req, res) => {
  try {
    const pizzaBases = await PizzaBase.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: pizzaBases.length,
      data: pizzaBases
    });
  } catch (error) {
    console.error('Get pizza bases error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching pizza bases'
    });
  }
};

// @desc    Get single pizza base
// @route   GET /api/pizza-bases/:id
// @access  Public
const getPizzaBase = async (req, res) => {
  try {
    const pizzaBase = await PizzaBase.findById(req.params.id);

    if (!pizzaBase) {
      return res.status(404).json({
        success: false,
        error: 'Pizza base not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pizzaBase
    });
  } catch (error) {
    console.error('Get pizza base error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching pizza base'
    });
  }
};

// @desc    Create pizza base
// @route   POST /api/pizza-bases
// @access  Private/Admin
const createPizzaBase = async (req, res) => {
  try {
    const pizzaBase = await PizzaBase.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Pizza base created successfully',
      data: pizzaBase
    });
  } catch (error) {
    console.error('Create pizza base error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating pizza base'
    });
  }
};

// @desc    Update pizza base
// @route   PUT /api/pizza-bases/:id
// @access  Private/Admin
const updatePizzaBase = async (req, res) => {
  try {
    const pizzaBase = await PizzaBase.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!pizzaBase) {
      return res.status(404).json({
        success: false,
        error: 'Pizza base not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pizza base updated successfully',
      data: pizzaBase
    });
  } catch (error) {
    console.error('Update pizza base error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating pizza base'
    });
  }
};

// @desc    Delete pizza base
// @route   DELETE /api/pizza-bases/:id
// @access  Private/Admin
const deletePizzaBase = async (req, res) => {
  try {
    const pizzaBase = await PizzaBase.findById(req.params.id);

    if (!pizzaBase) {
      return res.status(404).json({
        success: false,
        error: 'Pizza base not found'
      });
    }

    await pizzaBase.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Pizza base deleted successfully'
    });
  } catch (error) {
    console.error('Delete pizza base error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error deleting pizza base'
    });
  }
};

// @desc    Update pizza base stock
// @route   PUT /api/pizza-bases/:id/stock
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

    const pizzaBase = await PizzaBase.findById(req.params.id);

    if (!pizzaBase) {
      return res.status(404).json({
        success: false,
        error: 'Pizza base not found'
      });
    }

    if (operation === 'add') {
      pizzaBase.stockQuantity += quantity;
    } else if (operation === 'subtract') {
      if (pizzaBase.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient stock'
        });
      }
      pizzaBase.stockQuantity -= quantity;
    }

    await pizzaBase.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: pizzaBase
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
  .get(getAllPizzaBases)
  .post(protect, authorize('admin'), createPizzaBase);

router.route('/:id')
  .get(getPizzaBase)
  .put(protect, authorize('admin'), updatePizzaBase)
  .delete(protect, authorize('admin'), deletePizzaBase);

router.put('/:id/stock', protect, authorize('admin'), updateStock);

module.exports = router;
