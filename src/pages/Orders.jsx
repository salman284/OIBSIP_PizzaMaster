import React, { useState, useEffect } from "react";
import { Order } from "../entities/Order";
import { User } from "../entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Clock, MapPin, Phone, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        const userOrders = await Order.filter({ customer_email: currentUser.email }, "-created_date");
        setOrders(userOrders);
      } catch (error) {
        console.error("Error loading orders:", error);
      }
      setIsLoading(false);
    };
    loadOrders();
  }, []);

  const statusInfo = {
    pending: { 
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "Your order is being processed"
    },
    confirmed: { 
      color: "bg-blue-100 text-blue-800 border-blue-200",
      description: "Order confirmed and queued for kitchen"
    },
    in_kitchen: { 
      color: "bg-purple-100 text-purple-800 border-purple-200",
      description: "Your pizza is being prepared"
    },
    out_for_delivery: { 
      color: "bg-orange-100 text-orange-800 border-orange-200",
      description: "Your pizza is on the way!"
    },
    delivered: { 
      color: "bg-green-100 text-green-800 border-green-200",
      description: "Order completed - Enjoy your pizza!"
    }
  };

  const getEstimatedTime = (order) => {
    if (order.status === 'delivered') return 'Delivered';
    if (order.estimated_delivery) {
      const estimatedTime = new Date(order.estimated_delivery);
      const now = new Date();
      const diffMinutes = Math.max(0, Math.ceil((estimatedTime - now) / (1000 * 60)));
      if (diffMinutes === 0) return 'Any moment now';
      return `${diffMinutes} minutes`;
    }
    return 'Calculating...';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track your delicious pizza orders</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="text-center p-8 bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <CardContent>
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
                <p className="text-gray-600 mb-6">Ready to create your first delicious pizza?</p>
                <Button className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600">
                  Build Your Pizza
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">
                          Order #{order.id?.slice(-6).toUpperCase()}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_date).toLocaleDateString()} at {new Date(order.created_date).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${statusInfo[order.status]?.color} border mb-2`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <p className="text-2xl font-bold text-red-600">${order.total_price?.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Order Details */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Pizza Details</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Base:</span> {order.pizza_base}</p>
                          <p><span className="font-medium">Sauce:</span> {order.sauce}</p>
                          <p><span className="font-medium">Cheese:</span> {order.cheese}</p>
                          {order.toppings && order.toppings.length > 0 && (
                            <div>
                              <span className="font-medium">Toppings:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {order.toppings.map((topping, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {topping}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Delivery Info */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span>{order.delivery_address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>{order.customer_phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
                            <span>
                              <span className="font-medium">ETA:</span> {getEstimatedTime(order)}
                            </span>
                          </div>
                          {order.special_instructions && (
                            <div className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                              <span>
                                <span className="font-medium">Instructions:</span> {order.special_instructions}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Description */}
                    <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-red-500" />
                        {statusInfo[order.status]?.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}