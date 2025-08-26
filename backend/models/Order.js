const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer_email: {
    type: String,
    required: [true, 'Customer email is required'],
    lowercase: true
  },
  customer_name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  customer_phone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  delivery_address: {
    type: String,
    required: [true, 'Delivery address is required'],
    trim: true
  },
  pizza_base: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PizzaBase',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  sauce: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sauce',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  cheese: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cheese',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  },
  toppings: [{
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topping',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  total_price: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_kitchen', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  special_instructions: {
    type: String,
    trim: true,
    maxlength: [500, 'Special instructions cannot be more than 500 characters']
  },
  estimated_delivery: {
    type: Date
  },
  actual_delivery: {
    type: Date
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  payment_method: {
    type: String,
    enum: ['cash', 'card', 'online'],
    default: 'cash'
  },
  order_notes: [{
    note: {
      type: String,
      required: true
    },
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    added_at: {
      type: Date,
      default: Date.now
    }
  }],
  status_history: [{
    status: {
      type: String,
      required: true
    },
    changed_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changed_at: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String
    }
  }],
  delivery_fee: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ user: 1 });
orderSchema.index({ customer_email: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ estimated_delivery: 1 });
orderSchema.index({ payment_status: 1 });

// Virtual for order number
orderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Pre-save middleware to add status history
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.status_history.push({
      status: this.status,
      changed_at: new Date()
    });
  }
  next();
});

// Method to calculate delivery time
orderSchema.methods.calculateDeliveryTime = function() {
  const baseTime = 30; // 30 minutes base delivery time
  const toppingTime = this.toppings.length * 2; // 2 minutes per topping
  return baseTime + toppingTime;
};

// Method to update status with history
orderSchema.methods.updateStatus = function(newStatus, changedBy, note) {
  this.status = newStatus;
  this.status_history.push({
    status: newStatus,
    changed_by: changedBy,
    changed_at: new Date(),
    note: note
  });
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);
