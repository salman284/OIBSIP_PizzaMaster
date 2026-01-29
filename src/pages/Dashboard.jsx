import React, { useState, useEffect } from "react";
import { User } from "../entities/User";
import { Order } from "../entities/Order";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils-app";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Pizza, Clock, ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        const orders = await Order.filter({ customer_email: currentUser.email }, "-created_date", 5);
        setRecentOrders(orders);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setIsLoading(false);
    };
    loadData();
  }, []);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200", 
    in_kitchen: "bg-purple-100 text-purple-800 border-purple-200",
    out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200"
  };

  const featuredPizzas = [
    {
      name: "Margherita Classic",
      description: "Fresh mozzarella, tomato sauce, basil",
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
      price: 12.99
    },
    {
      name: "Pepperoni Supreme",
      description: "Pepperoni, mozzarella, oregano",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&q=80",
      price: 15.99
    },
    {
      name: "Veggie Deluxe",
      description: "Bell peppers, mushrooms, olives, onions",
      image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop",
      price: 14.99
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-red-600">PizzaMaster</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Craft your perfect pizza with our premium ingredients and artisan techniques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("PizzaBuilder")}>
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300">
                <Pizza className="w-6 h-6 mr-2" />
                Build Your Pizza
              </Button>
            </Link>
            <Link to={createPageUrl("Orders")}>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-full border-2 border-red-600 text-red-600 hover:bg-red-50">
                <ShoppingCart className="w-6 h-6 mr-2" />
                View Orders
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Featured Pizzas */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Pizzas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPizzas.map((pizza, index) => (
              <motion.div
                key={pizza.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="relative overflow-hidden">
                    <img 
                      src={pizza.image} 
                      alt={pizza.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-red-600 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-gray-900">{pizza.name}</CardTitle>
                    <p className="text-gray-600">{pizza.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-red-600">${pizza.price}</span>
                      <Link to={createPageUrl("PizzaBuilder")}>
                        <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600">
                          Customize
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-500" />
                  Recent Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.pizza_base?.name || order.pizza_base || 'Pizza'} with {order.sauce?.name || order.sauce || 'Tomato'} sauce
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()} • ${order.total_price?.toFixed(2)}
                        </p>
                      </div>
                      <Badge className={`${statusColors[order.status]} border`}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Link to={createPageUrl("Orders")}>
                    <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}
      </div>
    </div>
  );
}