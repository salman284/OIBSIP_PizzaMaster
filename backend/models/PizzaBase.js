const mongoose = require('mongoose');

const pizzaBaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pizza base name is required'],
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
    default: 50
  },
  min_threshold: {
    type: Number,
    required: [true, 'Minimum threshold is required'],
    min: [0, 'Minimum threshold cannot be negative'],
    default: 10
  },
  image_url: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    fiber: { type: Number, min: 0 }
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'eggs', 'soy', 'nuts', 'sesame']
  }],
  preparationTime: {
    type: Number, // in minutes
    default: 15
  }
}, {
  timestamps: true
});

// Indexes
pizzaBaseSchema.index({ name: 1 });
pizzaBaseSchema.index({ isActive: 1 });
pizzaBaseSchema.index({ stock: 1 });

// Virtual for low stock alert
pizzaBaseSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.min_threshold;
});

// Pre-save middleware to validate stock
pizzaBaseSchema.pre('save', function(next) {
  if (this.stock < 0) {
    next(new Error('Stock cannot be negative'));
  }
  if (this.min_threshold < 0) {
    next(new Error('Minimum threshold cannot be negative'));
  }
  next();
});

module.exports = mongoose.model('PizzaBase', pizzaBaseSchema);
