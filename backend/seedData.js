const mongoose = require('mongoose');
const PizzaBase = require('./models/PizzaBase');
const Sauce = require('./models/Sauce');
const Cheese = require('./models/Cheese');
const Topping = require('./models/Topping');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pizzamaster');
    console.log('Connected to MongoDB');

    // Clear existing data
    await PizzaBase.deleteMany({});
    await Sauce.deleteMany({});
    await Cheese.deleteMany({});
    await Topping.deleteMany({});

    // Seed Pizza Bases
    const pizzaBases = await PizzaBase.insertMany([
      {
        name: 'Thin Crust',
        description: 'Crispy and light thin crust',
        price: 99,
        stockQuantity: 50,
        isActive: true
      },
      {
        name: 'Thick Crust',
        description: 'Hearty and filling thick crust',
        price: 129,
        stockQuantity: 40,
        isActive: true
      },
      {
        name: 'Stuffed Crust',
        description: 'Cheese-filled crust for extra indulgence',
        price: 159,
        stockQuantity: 30,
        isActive: true
      },
      {
        name: 'Gluten-Free',
        description: 'Perfect for gluten-sensitive customers',
        price: 169,
        stockQuantity: 20,
        isActive: true
      },
      {
        name: 'Cauliflower Crust',
        description: 'Healthy cauliflower-based crust',
        price: 189,
        stockQuantity: 25,
        isActive: true
      }
    ]);

    // Seed Sauces
    const sauces = await Sauce.insertMany([
      {
        name: 'Classic Tomato',
        description: 'Traditional tomato base sauce',
        price: 29,
        stockQuantity: 100,
        isActive: true
      },
      {
        name: 'BBQ Sauce',
        description: 'Sweet and tangy barbecue sauce',
        price: 39,
        stockQuantity: 80,
        isActive: true
      },
      {
        name: 'White Sauce',
        description: 'Creamy garlic white sauce',
        price: 35,
        stockQuantity: 70,
        isActive: true
      },
      {
        name: 'Pesto',
        description: 'Fresh basil pesto sauce',
        price: 49,
        stockQuantity: 60,
        isActive: true
      },
      {
        name: 'Buffalo Sauce',
        description: 'Spicy buffalo wing sauce',
        price: 45,
        stockQuantity: 50,
        isActive: true
      }
    ]);

    // Seed Cheeses
    const cheeses = await Cheese.insertMany([
      {
        name: 'Mozzarella',
        description: 'Classic stretchy mozzarella cheese',
        price: 49,
        stockQuantity: 200,
        isActive: true
      },
      {
        name: 'Cheddar',
        description: 'Sharp and flavorful cheddar',
        price: 59,
        stockQuantity: 150,
        isActive: true
      },
      {
        name: 'Parmesan',
        description: 'Rich and nutty parmesan',
        price: 69,
        stockQuantity: 100,
        isActive: true
      },
      {
        name: 'Feta',
        description: 'Tangy Mediterranean feta cheese',
        price: 79,
        stockQuantity: 80,
        isActive: true
      }
    ]);

    // Seed Toppings
    const toppings = await Topping.insertMany([
      // Meat Toppings
      {
        name: 'Pepperoni',
        description: 'Classic spicy pepperoni slices',
        category: 'meat',
        price: 69,
        stockQuantity: 150,
        isActive: true
      },
      {
        name: 'Italian Sausage',
        description: 'Seasoned Italian sausage',
        category: 'meat',
        price: 79,
        stockQuantity: 120,
        isActive: true
      },
      {
        name: 'Bacon',
        description: 'Crispy bacon bits',
        category: 'meat',
        price: 89,
        stockQuantity: 100,
        isActive: true
      },
      {
        name: 'Ham',
        description: 'Lean diced ham',
        category: 'meat',
        price: 75,
        stockQuantity: 110,
        isActive: true
      },
      // Vegetable Toppings
      {
        name: 'Mushrooms',
        description: 'Fresh button mushrooms',
        category: 'vegetable',
        price: 39,
        stockQuantity: 200,
        isActive: true
      },
      {
        name: 'Bell Peppers',
        description: 'Colorful bell pepper mix',
        category: 'vegetable',
        price: 35,
        stockQuantity: 180,
        isActive: true
      },
      {
        name: 'Red Onions',
        description: 'Sweet red onion slices',
        category: 'vegetable',
        price: 29,
        stockQuantity: 160,
        isActive: true
      },
      {
        name: 'Black Olives',
        description: 'Mediterranean black olives',
        category: 'vegetable',
        price: 45,
        stockQuantity: 140,
        isActive: true
      },
      {
        name: 'Tomatoes',
        description: 'Fresh cherry tomato halves',
        category: 'vegetable',
        price: 35,
        stockQuantity: 170,
        isActive: true
      },
      {
        name: 'Spinach',
        description: 'Fresh baby spinach leaves',
        category: 'vegetable',
        price: 39,
        stockQuantity: 130,
        isActive: true
      },
      // Premium Toppings
      {
        name: 'Prosciutto',
        description: 'Premium Italian prosciutto',
        category: 'premium',
        price: 119,
        stockQuantity: 50,
        isActive: true
      },
      {
        name: 'Truffle Oil',
        description: 'Aromatic truffle oil drizzle',
        category: 'premium',
        price: 99,
        stockQuantity: 30,
        isActive: true
      },
      {
        name: 'Goat Cheese',
        description: 'Creamy goat cheese crumbles',
        category: 'premium',
        price: 89,
        stockQuantity: 40,
        isActive: true
      }
    ]);

    console.log('✅ Seed data inserted successfully!');
    console.log(`📊 Inserted:`);
    console.log(`   • ${pizzaBases.length} Pizza Bases`);
    console.log(`   • ${sauces.length} Sauces`);
    console.log(`   • ${cheeses.length} Cheeses`);
    console.log(`   • ${toppings.length} Toppings`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
