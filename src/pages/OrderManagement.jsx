import React, { useState, useEffect } from "react";
import { Order, User } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { AlertTriangle, Clock, MapPin, Phone, MessageSquare, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [updatingOrders, setUpdatingOrders] = useState({});

  useEffect(() => {
    const loadOrders = async () => {
      try {
        console.log('🔐 Loading user data for order management...');
        const currentUser = await User.me();
        console.log('👤 User loaded:', currentUser);
        setUser(currentUser);

        if (currentUser?.role !== 'admin') {
          console.log('❌ Access denied - user role:', currentUser?.role);
          alert("Access denied. Admin privileges required.");
          return;
        }

        console.log('📦 Loading orders...');
        const allOrders = await Order.listAll();
        console.log('📋 Orders loaded:', allOrders?.length || 0, 'orders');
        setOrders(allOrders || []);
        setFilteredOrders(allOrders || []);
      } catch (error) {
        console.error("❌ Error loading orders:", error);
        alert(`Error loading orders: ${error.message}`);
      }
      setIsLoading(false);
    };

    loadOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrders(prev => ({ ...prev, [orderId]: true }));
    
    try {
      console.log('🔄 Updating order status:', { orderId, newStatus });
      await Order.update(orderId, { status: newStatus });
      console.log('✅ Order status updated successfully');
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order =>
          (order.id || order._id) === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert(`Error updating order status: ${error.message}. Please try again.`);
    }
    
    setUpdatingOrders(prev => {
      const newState = { ...prev };
      delete newState[orderId];
      return newState;
    });
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    in_kitchen: "bg-purple-100 text-purple-800 border-purple-200",
    out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
    delivered: "bg-green-100 text-green-800 border-green-200"
  };

  const statusOptions = [
    { value: "pending", label: "Order Received" },
    { value: "confirmed", label: "Confirmed" },
    { value: "in_kitchen", label: "In Kitchen" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" }
  ];

  const getStatusCounts = () => {
    const counts = {};
    statusOptions.forEach(option => {
      counts[option.value] = orders.filter(order => order.status === option.value).length;
    });
    return counts;
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

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Process and track pizza orders</p>
        </motion.div>

        {/* Status Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {statusOptions.map((status, index) => (
            <Card key={status.value} className="bg-white/80 backdrop-blur-sm shadow-lg border-0 text-center">
              <CardContent className="p-4">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${statusColors[status.value]}`}>
                  <span className="font-bold text-lg">{statusCounts[status.value]}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{status.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4">
                  <Package className="w-5 h-5 text-red-500" />
                  <span className="font-medium text-gray-900">Filter Orders:</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="All Orders" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Orders ({orders.length})</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label} ({statusCounts[status.value]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-gray-600">
                  Showing {filteredOrders.length} of {orders.length} orders
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 text-center p-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
                <p className="text-gray-600">
                  {statusFilter === "all" ? "No orders have been placed yet." : `No orders with status "${statusFilter}".`}
                </p>
              </Card>
            </motion.div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">
                          Order #{(order.id || order._id)?.slice(-6)?.toUpperCase() || 'Unknown'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" />
                          {order.created_date ? new Date(order.created_date).toLocaleString() : 'Date unknown'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${statusColors[order.status] || statusColors.pending} border mb-2`}>
                          {(order.status || 'pending').replace('_', ' ').toUpperCase()}
                        </Badge>
                        <p className="text-2xl font-bold text-red-600">${(order.total_price || 0).toFixed(2)}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Customer Details</h3>
                        <div className="space-y-2 text-sm">
                          <p className="font-medium text-gray-900">{order.customer_name || 'Unknown Customer'}</p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-red-500" />
                            {order.customer_phone || 'No phone provided'}
                          </p>
                          <p className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                            <span>{order.delivery_address || 'No address provided'}</span>
                          </p>
                          {order.special_instructions && (
                            <p className="flex items-start gap-2">
                              <MessageSquare className="w-4 h-4 text-red-500 mt-0.5" />
                              <span className="italic">{order.special_instructions}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Pizza Details */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Pizza Details</h3>
                        <div className="space-y-1 text-sm">
                          <p><span className="font-medium">Base:</span> {order.pizza_base?.name || order.pizza_base || 'Not specified'}</p>
                          <p><span className="font-medium">Sauce:</span> {order.sauce?.name || order.sauce || 'Not specified'}</p>
                          <p><span className="font-medium">Cheese:</span> {order.cheese?.name || order.cheese || 'Not specified'}</p>
                          {order.toppings && Array.isArray(order.toppings) && order.toppings.length > 0 && (
                            <div>
                              <span className="font-medium">Toppings:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {order.toppings.map((topping, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {topping?.name || topping || 'Unknown topping'}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Update */}
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                        <div className="space-y-3">
                          <Select
                            value={order.status || 'pending'}
                            onValueChange={(newStatus) => updateOrderStatus(order.id || order._id, newStatus)}
                            disabled={updatingOrders[order.id || order._id]}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {updatingOrders[order.id || order._id] && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              Updating status...
                            </div>
                          )}
                          
                          {order.estimated_delivery && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">ETA:</span>{' '}
                              {new Date(order.estimated_delivery).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}