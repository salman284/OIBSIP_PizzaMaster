const PizzaBase = require('../models/PizzaBase');
const Sauce = require('../models/Sauce');
const Cheese = require('../models/Cheese');
const Topping = require('../models/Topping');
const User = require('../models/User');
const { sendEmail } = require('../utils/sendEmail');

const checkLowStock = async () => {
  try {
    const lowStockThreshold = 10;

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
      console.log('✅ All items are adequately stocked');
      return;
    }

    console.log(`⚠️ Found ${lowStockItems.length} low stock items`);

    // Get admin users
    const adminUsers = await User.find({ role: 'admin' });

    if (adminUsers.length === 0) {
      console.log('⚠️ No admin users found to send low stock alerts');
      return;
    }

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
        <h2 style="color: #dc2626;">⚠️ Automated Low Stock Alert - PizzaMaster</h2>
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

        <p>This is an automated alert from the PizzaMaster inventory management system.</p>
        <p>Generated at: ${new Date().toLocaleString()}</p>
      </div>
    `;

    // Send email to all admin users via HTTPS sendEmail
    const emailPromises = adminUsers.map(admin => {
      return sendEmail(
        admin.email,
        `🚨 Automated Low Stock Alert - ${lowStockItems.length} Items Need Restocking`,
        emailContent
      );
    });

    await Promise.allSettled(emailPromises);
    console.log(`📧 Low stock alert sent to ${adminUsers.length} admin(s)`);

  } catch (error) {
    console.error('❌ Error checking low stock:', error);
  }
};

module.exports = {
  checkLowStock
};
