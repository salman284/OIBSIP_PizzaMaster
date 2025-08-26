const express = require('express');
const Order = require('../models/Order');
const User = require('../models/User');
const PizzaBase = require('../models/PizzaBase');
const Sauce = require('../models/Sauce');
const Cheese = require('../models/Cheese');
const Topping = require('../models/Topping');
const nodemailer = require('nodemailer');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, specialInstructions } = req.body;

    // Validate and calculate order total
    let orderTotal = 0;
    const processedItems = [];

    for (const item of items) {
      const { pizzaBase, sauce, cheese, toppings, size, quantity } = item;

      // Get pizza base
      const baseData = await PizzaBase.findById(pizzaBase);
      if (!baseData || baseData.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for pizza base: ${baseData?.name || 'Unknown'}`
        });
      }

      // Get sauce
      const sauceData = await Sauce.findById(sauce);
      if (!sauceData || sauceData.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for sauce: ${sauceData?.name || 'Unknown'}`
        });
      }

      // Get cheese
      const cheeseData = await Cheese.findById(cheese);
      if (!cheeseData || cheeseData.stockQuantity < quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for cheese: ${cheeseData?.name || 'Unknown'}`
        });
      }

      // Calculate item price
      let itemPrice = baseData.price + sauceData.price + cheeseData.price;

      // Add toppings
      const toppingDetails = [];
      for (const toppingId of toppings) {
        const toppingData = await Topping.findById(toppingId);
        if (!toppingData || toppingData.stockQuantity < quantity) {
          return res.status(400).json({
            success: false,
            error: `Insufficient stock for topping: ${toppingData?.name || 'Unknown'}`
          });
        }
        itemPrice += toppingData.price;
        toppingDetails.push({
          toppingId: toppingData._id,
          name: toppingData.name,
          price: toppingData.price
        });
      }

      // Apply size multiplier
      const sizeMultiplier = size === 'large' ? 1.5 : size === 'medium' ? 1.25 : 1;
      itemPrice *= sizeMultiplier;

      const totalItemPrice = itemPrice * quantity;
      orderTotal += totalItemPrice;

      processedItems.push({
        pizzaBase: {
          pizzaBaseId: baseData._id,
          name: baseData.name,
          price: baseData.price
        },
        sauce: {
          sauceId: sauceData._id,
          name: sauceData.name,
          price: sauceData.price
        },
        cheese: {
          cheeseId: cheeseData._id,
          name: cheeseData.name,
          price: cheeseData.price
        },
        toppings: toppingDetails,
        size,
        quantity,
        unitPrice: itemPrice,
        totalPrice: totalItemPrice
      });
    }

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: processedItems,
      totalAmount: orderTotal,
      deliveryAddress,
      paymentMethod,
      specialInstructions
    });

    // Update stock quantities
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const quantity = item.quantity;

      // Update pizza base stock
      await PizzaBase.findByIdAndUpdate(item.pizzaBase, {
        $inc: { stockQuantity: -quantity }
      });

      // Update sauce stock
      await Sauce.findByIdAndUpdate(item.sauce, {
        $inc: { stockQuantity: -quantity }
      });

      // Update cheese stock
      await Cheese.findByIdAndUpdate(item.cheese, {
        $inc: { stockQuantity: -quantity }
      });

      // Update toppings stock
      for (const toppingId of item.toppings) {
        await Topping.findByIdAndUpdate(toppingId, {
          $inc: { stockQuantity: -quantity }
        });
      }
    }

    // Add order to user's order history
    await User.findByIdAndUpdate(req.user.id, {
      $push: { orderHistory: order._id }
    });

    // Send order confirmation email
    const user = await User.findById(req.user.id);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation - PizzaMaster (Order #${order.orderNumber})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Order Confirmation</h2>
          <p>Hi ${user.firstName},</p>
          <p>Thank you for your order! Your pizza is being prepared.</p>
          
          <div style="background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Total Amount:</strong> $${order.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Estimated Delivery:</strong> ${order.estimatedDeliveryTime.toLocaleString()}</p>
          </div>

          <p>You can track your order status in your dashboard.</p>
          <p>Best regards,<br>PizzaMaster Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    // Populate order for response
    const populatedOrder = await Order.findById(order._id).populate('user', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error creating order'
    });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching orders'
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching order'
    });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const startIndex = (page - 1) * limit;

    let query = {};
    if (status) {
      query.status = status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: orders
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching orders'
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.status = status;

    // Update estimated delivery time for certain statuses
    if (status === 'preparing') {
      order.estimatedDeliveryTime = new Date(Date.now() + 30 * 60000); // 30 minutes
    } else if (status === 'out_for_delivery') {
      order.estimatedDeliveryTime = new Date(Date.now() + 15 * 60000); // 15 minutes
    } else if (status === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    // Send status update email
    const statusMessages = {
      'confirmed': 'Your order has been confirmed and is being prepared.',
      'preparing': 'Your pizza is now being prepared in our kitchen.',
      'ready': 'Your order is ready for pickup/delivery.',
      'out_for_delivery': 'Your order is out for delivery.',
      'delivered': 'Your order has been delivered. Enjoy your meal!',
      'cancelled': 'Your order has been cancelled.'
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: order.user.email,
      subject: `Order Update - PizzaMaster (Order #${order.orderNumber})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Order Status Update</h2>
          <p>Hi ${order.user.firstName},</p>
          <p>${statusMessages[status]}</p>
          
          <div style="background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Status:</strong> ${order.status.replace('_', ' ').toUpperCase()}</p>
            ${order.estimatedDeliveryTime ? `<p><strong>Estimated Delivery:</strong> ${order.estimatedDeliveryTime.toLocaleString()}</p>` : ''}
          </div>

          <p>Thank you for choosing PizzaMaster!</p>
          <p>Best regards,<br>PizzaMaster Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error updating order status'
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns the order
    if (order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel if order is pending or confirmed
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    await order.save();

    // Restore stock quantities
    for (const item of order.items) {
      await PizzaBase.findByIdAndUpdate(item.pizzaBase.pizzaBaseId, {
        $inc: { stockQuantity: item.quantity }
      });

      await Sauce.findByIdAndUpdate(item.sauce.sauceId, {
        $inc: { stockQuantity: item.quantity }
      });

      await Cheese.findByIdAndUpdate(item.cheese.cheeseId, {
        $inc: { stockQuantity: item.quantity }
      });

      for (const topping of item.toppings) {
        await Topping.findByIdAndUpdate(topping.toppingId, {
          $inc: { stockQuantity: item.quantity }
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error cancelling order'
    });
  }
};

// Routes
router.route('/')
  .get(protect, getUserOrders)
  .post(protect, createOrder);

router.get('/admin/all', protect, authorize('admin'), getAllOrders);

router.route('/:id')
  .get(protect, getOrder);

router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
