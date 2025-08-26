import React, { useState, useEffect } from "react";
import { Order, PizzaBase, Sauce, Cheese, Topping, User } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Package, ShoppingCart, AlertTriangle, Users, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [data, setData] = useState({
    orders: [],
    inventory: {
      bases: [],
      sauces: [],
      cheeses: [],
      toppings: []
    },
    stats: {
      totalOrders: 0,
      todayOrders: 0,
      totalRevenue: 0,
      lowStockItems: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);

        if (currentUser.role !== 'admin') {
          alert("Access denied. Admin privileges required.");
          return;
        }

        const [orders, bases, sauces, cheeses, toppings] = await Promise.all([
          Order.list("-created_date", 20),
          PizzaBase.list(),
          Sauce.list(),
          Cheese.list(),
          Topping.list()
        ]);

        // Calculate stats
        const today = new Date().toDateString();
        const todayOrders = orders.filter(order => 
          new Date(order.created_date).toDateString() === today
        );

        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_price || 0), 0);

        const allInventory = [...bases, ...sauces, ...cheeses, ...toppings];
        const lowStockItems = allInventory.filter(item => 
          item.stock <= item.min_threshold
        ).length;

        setData({
          orders,
          inventory: { bases, sauces, cheeses, toppings },
          stats: {
            totalOrders: orders.length,
            todayOrders: todayOrders.length,
            totalRevenue,
            lowStockItems
          }
        });

      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    in_kitchen: "bg-purple-100 text-purple-800 border-purple-200", 
    out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200"
  };

  const getLowStockItems = () => {
    const allItems = [
      ...data.inventory.bases.map(item => ({ ...item, type: 'Base' })),
      ...data.inventory.sauces.map(item => ({ ...item, type: 'Sauce' })),
      ...data.inventory.cheeses.map(item => ({ ...item, type: 'Cheese' })),
      ...data.inventory.toppings.map(item => ({ ...item, type: 'Topping' }))
    ];
    
    return allItems.filter(item => item.stock <= item.min_threshold);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8 flex items-center justify-center">
        <Card className="max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your pizza restaurant operations</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-full transform translate-x-6 -translate-y-6"></div>
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{data.stats.totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-blue-500" />
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500 opacity-10 rounded-full transform translate-x-6 -translate-y-6"></div>
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Orders</p>
                <p className="text-3xl font-bold text-gray-900">{data.stats.todayOrders}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500 opacity-10 rounded-full transform translate-x-6 -translate-y-6"></div>
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${data.stats.totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </CardHeader>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 opacity-10 rounded-full transform translate-x-6 -translate-y-6"></div>
            <CardHeader className="flex flex-row items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900">{data.stats.lowStockItems}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </CardHeader>
          </Card>
        </motion.div>

        {/* Low Stock Alert */}
        {data.stats.lowStockItems > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Stock Alert:</strong> {data.stats.lowStockItems} items are running low on stock. Check inventory to restock.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {order.customer_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.pizza_base} • ${order.total_price?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_date).toLocaleString()}
                        </p>
                      </div>
                      <Badge className={`${statusColors[order.status]} border`}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Low Stock Items */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getLowStockItems().length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">All items are well stocked!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getLowStockItems().map((item) => (
                      <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="destructive" className="mb-1">
                            {item.stock} left
                          </Badge>
                          <p className="text-xs text-gray-500">
                            Min: {item.min_threshold}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}