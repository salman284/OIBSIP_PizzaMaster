const mongoose = require('mongoose');

const sauceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sauce name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 30
  },
  min_threshold: {
    type: Number,
    required: [true, 'Minimum threshold is required'],
    min: [0, 'Minimum threshold cannot be negative'],
    default: 5
  },
  color: {
    type: String,
    trim: true,
    default: '#dc2626'
  },
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra_hot'],
    default: 'mild'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'eggs', 'soy', 'nuts', 'sesame', 'tomatoes']
  }]
}, {
  timestamps: true
});

// Indexes
sauceSchema.index({ name: 1 });
sauceSchema.index({ isActive: 1 });
sauceSchema.index({ stock: 1 });
sauceSchema.index({ spiceLevel: 1 });

// Virtual for low stock alert
sauceSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.min_threshold;
});

module.exports = mongoose.model('Sauce', sauceSchema);
