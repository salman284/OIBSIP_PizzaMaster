import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserEntity } from '../entities/User';
import { Order } from '../entities/Order';
import { Calendar, Shield, Clock, CheckCircle, User as UserIcon, Mail, Phone, MapPin } from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalSpent: 0
  });

  useEffect(() => {
    loadUserData();
    loadUserOrders();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await UserEntity.me();
      setUser(userData);
      setEditData({
        name: userData.name || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserOrders = async () => {
    try {
      const orderData = await Order.list();
      setOrders(orderData.slice(0, 3)); // Last 3 orders
      
      // Calculate statistics
      const totalOrders = orderData.length;
      const totalSpent = orderData.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      
      setStatistics({
        totalOrders,
        totalSpent
      });
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await UserEntity.updateMyUserData(editData);
      setUser({ ...user, ...editData });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user.name || '',
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAccountStatus = () => {
    return user?.status || 'Active';
  };

  const getMembershipDuration = () => {
    if (!user?.createdAt) return 'N/A';
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - createdDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information and view your order history</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{user?.name || 'Not provided'}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{user?.email || 'Not provided'}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{user?.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{user?.address || 'Not provided'}</p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Statistics Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Statistics</h3>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">Total Orders</h4>
                <p className="text-3xl font-bold">{statistics.totalOrders}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white">
                <h4 className="text-lg font-semibold mb-2">Total Spent</h4>
                <p className="text-3xl font-bold">${statistics.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Account Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-orange-500" />
            Account Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Account Status */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-gray-800">Status</h4>
              </div>
              <p className="text-green-700 font-medium">{getAccountStatus()}</p>
            </div>

            {/* Member Since */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-gray-800">Member Since</h4>
              </div>
              <p className="text-blue-700 font-medium">{formatDate(user?.createdAt)}</p>
            </div>

            {/* Account Age */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-gray-800">Membership</h4>
              </div>
              <p className="text-purple-700 font-medium">{getMembershipDuration()}</p>
            </div>

            {/* User ID */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-5 h-5 text-gray-600" />
                <h4 className="font-semibold text-gray-800">User ID</h4>
              </div>
              <p className="text-gray-700 font-medium text-xs">#{user?._id?.slice(-8) || 'N/A'}</p>
            </div>
          </div>

          {/* Additional Account Information */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-600" />
                Contact Information
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Email:</span> <span className="font-medium">{user?.email || 'Not provided'}</span></p>
                <p><span className="text-gray-600">Phone:</span> <span className="font-medium">{user?.phone || 'Not provided'}</span></p>
                <p><span className="text-gray-600">Address:</span> <span className="font-medium">{user?.address || 'Not provided'}</span></p>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Account Security
              </h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-600">Role:</span> <span className="font-medium capitalize">{user?.role || 'Customer'}</span></p>
                <p><span className="text-gray-600">Last Updated:</span> <span className="font-medium">{formatDate(user?.updatedAt)}</span></p>
                <p><span className="text-gray-600">Account Status:</span> <span className="font-medium text-green-600">Verified</span></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-white rounded-2xl shadow-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h3>
          
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order, index) => (
                <div key={order._id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">Order #{order._id?.slice(-6) || 'N/A'}</h4>
                      <p className="text-gray-600 text-sm">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status || 'Pending'}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Base:</span> {order.pizzaBase?.name || 'N/A'}
                    </p>
                    <p className="text-gray-700 mb-2">
                      <span className="font-medium">Sauce:</span> {order.sauce?.name || 'N/A'}
                    </p>
                    {order.cheese && (
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Cheese:</span> {order.cheese.name}
                      </p>
                    )}
                    {order.toppings && order.toppings.length > 0 && (
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Toppings:</span> {order.toppings.map(t => t.name).join(', ')}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-orange-600">
                      ${order.totalPrice?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h4>
              <p className="text-gray-500">Start by building your first pizza!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
