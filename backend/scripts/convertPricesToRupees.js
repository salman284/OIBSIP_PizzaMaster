const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const PizzaBase = require('../models/PizzaBase');
const Sauce = require('../models/Sauce');
const Cheese = require('../models/Cheese');
const Topping = require('../models/Topping');

const priceMap = {
  // Bases
  'Thin Crust': 99,
  'Thick Crust': 129,
  'Stuffed Crust': 159,
  'Gluten-Free': 169,
  'Cauliflower Crust': 189,

  // Sauces
  'Classic Tomato': 29,
  'BBQ Sauce': 39,
  'White Sauce': 35,
  'Pesto': 49,
  'Buffalo Sauce': 45,

  // Cheeses
  'Mozzarella': 49,
  'Cheddar': 59,
  'Parmesan': 69,
  'Feta': 79,

  // Toppings
  'Pepperoni': 69,
  'Italian Sausage': 79,
  'Bacon': 89,
  'Ham': 75,
  'Mushrooms': 39,
  'Bell Peppers': 35,
  'Red Onions': 29,
  'Black Olives': 45,
  'Tomatoes': 35,
  'Spinach': 39,
  'Prosciutto': 119,
  'Truffle Oil': 99,
  'Goat Cheese': 89
};

const updatePrices = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/pizzamaster';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    const updateCollection = async (Model, modelName) => {
      const items = await Model.find({});
      let updatedCount = 0;

      for (const item of items) {
        let newPrice = priceMap[item.name];
        if (!newPrice && item.price < 25) {
          // If price is in dollars and not directly mapped, convert with approx factor
          newPrice = Math.round(item.price * 25);
        }

        if (newPrice && newPrice !== item.price) {
          item.price = newPrice;
          await item.save();
          console.log(`Updated ${modelName} "${item.name}": price set to ₹${newPrice}`);
          updatedCount++;
        }
      }

      console.log(`Total ${modelName} updated: ${updatedCount}/${items.length}`);
    };

    await updateCollection(PizzaBase, 'PizzaBase');
    await updateCollection(Sauce, 'Sauce');
    await updateCollection(Cheese, 'Cheese');
    await updateCollection(Topping, 'Topping');

    console.log('All prices updated to Rupees successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating prices to rupees:', error);
    process.exit(1);
  }
};

updatePrices();
