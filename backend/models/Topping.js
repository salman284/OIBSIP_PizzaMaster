const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Topping name is required'],
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
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 20
  },
  minThreshold: {
    type: Number,
    required: [true, 'Minimum threshold is required'],
    min: [0, 'Minimum threshold cannot be negative'],
    default: 3
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['vegetable', 'meat', 'seafood', 'premium', 'other'],
    default: 'other'
  },
  image_url: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isVegetarian: {
    type: Boolean,
    default: true
  },
  allergens: [{
    type: String,
    enum: ['gluten', 'dairy', 'eggs', 'soy', 'nuts', 'sesame', 'shellfish', 'fish']
  }],
  nutritionalInfo: {
    calories: { type: Number, min: 0 },
    protein: { type: Number, min: 0 },
    carbs: { type: Number, min: 0 },
    fat: { type: Number, min: 0 },
    sodium: { type: Number, min: 0 }
  },
  preparationNotes: {
    type: String,
    maxlength: [200, 'Preparation notes cannot be more than 200 characters']
  }
}, {
  timestamps: true
});

// Indexes
toppingSchema.index({ name: 1 });
toppingSchema.index({ isActive: 1 });
toppingSchema.index({ stockQuantity: 1 });
toppingSchema.index({ category: 1 });
toppingSchema.index({ isVegan: 1 });
toppingSchema.index({ isVegetarian: 1 });

// Virtual for low stock alert
toppingSchema.virtual('isLowStock').get(function() {
  return this.stockQuantity <= this.minThreshold;
});

module.exports = mongoose.model('Topping', toppingSchema);
