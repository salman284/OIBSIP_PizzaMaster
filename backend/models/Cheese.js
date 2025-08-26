const mongoose = require('mongoose');

const cheeseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cheese name is required'],
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
    default: 25
  },
  min_threshold: {
    type: Number,
    required: [true, 'Minimum threshold is required'],
    min: [0, 'Minimum threshold cannot be negative'],
    default: 5
  },
  type: {
    type: String,
    enum: ['mozzarella', 'cheddar', 'parmesan', 'goat', 'blue', 'vegan'],
    default: 'mozzarella'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  allergens: [{
    type: String,
    enum: ['dairy', 'lactose']
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    calcium: { type: Number, min: 0 }
  }
}, {
  timestamps: true
});

// Indexes
cheeseSchema.index({ name: 1 });
cheeseSchema.index({ isActive: 1 });
cheeseSchema.index({ stock: 1 });
cheeseSchema.index({ type: 1 });

// Virtual for low stock alert
cheeseSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.min_threshold;
});

module.exports = mongoose.model('Cheese', cheeseSchema);
