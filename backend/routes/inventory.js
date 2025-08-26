const express = require('express');
const nodemailer = require('nodemailer');
const PizzaBase = require('../models/PizzaBase');
const Sauce = require('../models/Sauce');
const Cheese = require('../models/Cheese');
const Topping = require('../models/Topping');
const User = require('../models/User');
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

// @desc    Get inventory dashboard
// @route   GET /api/inventory/dashboard
// @access  Private/Admin
const getInventoryDashboard = async (req, res) => {
  try {
    // Get low stock items
    const lowStockThreshold = 10;

    const [lowStockBases, lowStockSauces, lowStockCheeses, lowStockToppings] = await Promise.all([
      PizzaBase.find({ stockQuantity: { $lte: lowStockThreshold }, isActive: true }),
      Sauce.find({ stockQuantity: { $lte: lowStockThreshold }, isActive: true }),
      Cheese.find({ stockQuantity: { $lte: lowStockThreshold }, isActive: true }),
      Topping.find({ stockQuantity: { $lte: lowStockThreshold }, isActive: true })
    ]);

    // Get total inventory counts
    const [totalBases, totalSauces, totalCheeses, totalToppings] = await Promise.all([
      PizzaBase.countDocuments({ isActive: true }),
      Sauce.countDocuments({ isActive: true }),
      Cheese.countDocuments({ isActive: true }),
      Topping.countDocuments({ isActive: true })
    ]);

    // Calculate total stock values
    const [basesValue, saucesValue, cheesesValue, toppingsValue] = await Promise.all([
      PizzaBase.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$stockQuantity', '$price'] } } } }
      ]),
      Sauce.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$stockQuantity', '$price'] } } } }
      ]),
      Cheese.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$stockQuantity', '$price'] } } } }
      ]),
      Topping.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: { $multiply: ['$stockQuantity', '$price'] } } } }
      ])
    ]);

    const lowStockItems = [
      ...lowStockBases.map(item => ({ ...item.toObject(), type: 'Pizza Base' })),
      ...lowStockSauces.map(item => ({ ...item.toObject(), type: 'Sauce' })),
      ...lowStockCheeses.map(item => ({ ...item.toObject(), type: 'Cheese' })),
      ...lowStockToppings.map(item => ({ ...item.toObject(), type: 'Topping' }))
    ];

    const totalInventoryValue = 
      (basesValue[0]?.total || 0) + 
      (saucesValue[0]?.total || 0) + 
      (cheesesValue[0]?.total || 0) + 
      (toppingsValue[0]?.total || 0);

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalItems: totalBases + totalSauces + totalCheeses + totalToppings,
          lowStockItems: lowStockItems.length,
          totalValue: totalInventoryValue.toFixed(2)
        },
        categories: {
          pizzaBases: totalBases,
          sauces: totalSauces,
          cheeses: totalCheeses,
          toppings: totalToppings
        },
        lowStockItems: lowStockItems.sort((a, b) => a.stockQuantity - b.stockQuantity)
      }
    });
  } catch (error) {
    console.error('Get inventory dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching inventory dashboard'
    });
  }
};

// @desc    Get all inventory items
// @route   GET /api/inventory/items
// @access  Private/Admin
const getAllInventoryItems = async (req, res) => {
  try {
    const { category, search, sortBy, order } = req.query;

    let items = [];

    // Fetch items based on category
    if (!category || category === 'all') {
      const [bases, sauces, cheeses, toppings] = await Promise.all([
        PizzaBase.find({ isActive: true }),
        Sauce.find({ isActive: true }),
        Cheese.find({ isActive: true }),
        Topping.find({ isActive: true })
      ]);

      items = [
        ...bases.map(item => ({ ...item.toObject(), type: 'Pizza Base' })),
        ...sauces.map(item => ({ ...item.toObject(), type: 'Sauce' })),
        ...cheeses.map(item => ({ ...item.toObject(), type: 'Cheese' })),
        ...toppings.map(item => ({ ...item.toObject(), type: 'Topping' }))
      ];
    } else {
      switch (category) {
        case 'pizza-bases':
          const bases = await PizzaBase.find({ isActive: true });
          items = bases.map(item => ({ ...item.toObject(), type: 'Pizza Base' }));
          break;
        case 'sauces':
          const sauces = await Sauce.find({ isActive: true });
          items = sauces.map(item => ({ ...item.toObject(), type: 'Sauce' }));
          break;
        case 'cheeses':
          const cheeses = await Cheese.find({ isActive: true });
          items = cheeses.map(item => ({ ...item.toObject(), type: 'Cheese' }));
          break;
        case 'toppings':
          const toppings = await Topping.find({ isActive: true });
          items = toppings.map(item => ({ ...item.toObject(), type: 'Topping' }));
          break;
      }
    }

    // Apply search filter
    if (search) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy) {
      items.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (order === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });
    }

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Get all inventory items error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching inventory items'
    });
  }
};

// @desc    Send low stock alert
// @route   POST /api/inventory/low-stock-alert
// @access  Private/Admin
const sendLowStockAlert = async (req, res) => {
  try {
    const lowStockThreshold = req.body.threshold || 10;

    // Get low stock items
    const [lowStockBases, lowStockSauces, lowStockCheeses, lowStockToppings] = await Promise.all([
      PizzaBase.find({ stockQuantity: { $lte: lowStockThreshold }, isActive: true }),
      Sauce.find({ stockQuantity: { $lte: lowStockThreshold }, isActive: true }),
      Cheese.find({ stockQuantity: { $lte: lowStockThreshold }, isActive: true }),
      Topping.find({ stockQuantity: { $lte: lowStockThreshold }, isActive: true })
    ]);

    const lowStockItems = [
      ...lowStockBases.map(item => ({ ...item.toObject(), type: 'Pizza Base' })),
      ...lowStockSauces.map(item => ({ ...item.toObject(), type: 'Sauce' })),
      ...lowStockCheeses.map(item => ({ ...item.toObject(), type: 'Cheese' })),
      ...lowStockToppings.map(item => ({ ...item.toObject(), type: 'Topping' }))
    ];

    if (lowStockItems.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No low stock items found'
      });
    }

    // Get admin users
    const adminUsers = await User.find({ role: 'admin' });

    // Create email content
    const itemsList = lowStockItems
      .sort((a, b) => a.stockQuantity - b.stockQuantity)
      .map(item => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.type}</td>
          <td style="padding: 8px; border: 1px solid #ddd; color: ${item.stockQuantity <= 5 ? '#dc2626' : '#f59e0b'};">
            ${item.stockQuantity}
          </td>
        </tr>
      `).join('');

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">⚠️ Low Stock Alert - PizzaMaster</h2>
        <p>The following items are running low in stock and need immediate attention:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Item Name</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Type</th>
              <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Stock Quantity</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>

        <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Action Required:</strong> Please restock these items to avoid order fulfillment issues.</p>
        </div>

        <p>This alert was generated automatically by the PizzaMaster inventory management system.</p>
        <p>Best regards,<br>PizzaMaster System</p>
      </div>
    `;

    // Send email to all admin users
    const emailPromises = adminUsers.map(admin => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: admin.email,
        subject: `🚨 Low Stock Alert - ${lowStockItems.length} Items Need Restocking`,
        html: emailContent
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.status(200).json({
      success: true,
      message: `Low stock alert sent to ${adminUsers.length} admin(s)`,
      data: {
        lowStockItemsCount: lowStockItems.length,
        adminsNotified: adminUsers.length
      }
    });
  } catch (error) {
    console.error('Send low stock alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error sending low stock alert'
    });
  }
};

// @desc    Bulk update stock
// @route   PUT /api/inventory/bulk-update
// @access  Private/Admin
const bulkUpdateStock = async (req, res) => {
  try {
    const { updates } = req.body; // Array of { id, type, quantity, operation }

    const results = [];

    for (const update of updates) {
      const { id, type, quantity, operation } = update;

      let Model;
      switch (type) {
        case 'Pizza Base':
          Model = PizzaBase;
          break;
        case 'Sauce':
          Model = Sauce;
          break;
        case 'Cheese':
          Model = Cheese;
          break;
        case 'Topping':
          Model = Topping;
          break;
        default:
          continue;
      }

      try {
        const item = await Model.findById(id);
        if (!item) {
          results.push({ id, success: false, error: 'Item not found' });
          continue;
        }

        if (operation === 'add') {
          item.stockQuantity += quantity;
        } else if (operation === 'subtract') {
          if (item.stockQuantity < quantity) {
            results.push({ id, success: false, error: 'Insufficient stock' });
            continue;
          }
          item.stockQuantity -= quantity;
        } else if (operation === 'set') {
          item.stockQuantity = quantity;
        }

        await item.save();
        results.push({ 
          id, 
          success: true, 
          newStock: item.stockQuantity,
          name: item.name
        });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Bulk stock update completed',
      data: results
    });
  } catch (error) {
    console.error('Bulk update stock error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during bulk stock update'
    });
  }
};

// Routes
router.get('/dashboard', protect, authorize('admin'), getInventoryDashboard);
router.get('/items', protect, authorize('admin'), getAllInventoryItems);
router.post('/low-stock-alert', protect, authorize('admin'), sendLowStockAlert);
router.put('/bulk-update', protect, authorize('admin'), bulkUpdateStock);

module.exports = router;
