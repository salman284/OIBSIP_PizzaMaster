import React, { useState, useEffect } from "react";
import { PizzaBase, Sauce, Cheese, Topping, Order } from "../entities/all";
import { User } from "../entities/User";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, Minus, ShoppingCart } from "lucide-react";

export default function PizzaBuilder() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    base: null,
    sauce: null, 
    cheese: null,
    toppings: []
  });
  
  const [ingredients, setIngredients] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    toppings: []
  });
  
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    address: '',
    instructions: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadIngredients = async () => {
      try {
        // Load ingredients first (these are public)
        const [bases, sauces, cheeses, toppings] = await Promise.all([
          PizzaBase.list(),
          Sauce.list(),
          Cheese.list(), 
          Topping.list()
        ]);
        
        setIngredients({ bases, sauces, cheeses, toppings });
        
        // Try to load user data, but don't fail if not authenticated
        try {
          const currentUser = await User.me();
          setUser(currentUser);
          console.log("User loaded successfully:", currentUser);
          if (currentUser.phoneNumber) setCustomerInfo(prev => ({ ...prev, phone: currentUser.phoneNumber }));
          if (currentUser.address) setCustomerInfo(prev => ({ ...prev, address: currentUser.address }));
        } catch (userError) {
          console.log("User authentication error:", userError);
          console.log("Token in localStorage:", localStorage.getItem('token'));
          setUser(null);
          // User is not logged in, but that's okay for browsing ingredients
        }
        
      } catch (error) {
        console.error("Error loading ingredients:", error);
      }
      setIsLoading(false);
    };
    loadIngredients();
  }, []);

  const calculateTotal = () => {
    let total = 0;
    if (selection.base) total += selection.base.price;
    if (selection.sauce) total += selection.sauce.price;
    if (selection.cheese) total += selection.cheese.price;
    selection.toppings.forEach(topping => total += topping.price);
    return total;
  };

  const handleToppingToggle = (topping) => {
    setSelection(prev => ({
      ...prev,
      toppings: prev.toppings.find(t => t._id === topping._id)
        ? prev.toppings.filter(t => t._id !== topping._id)
        : [...prev.toppings, topping]
    }));
  };

  const placeOrder = async () => {
    if (!selection.base || !selection.sauce || !selection.cheese) {
      alert("Please complete your pizza selection");
      return;
    }
    
    console.log("Current user state:", user);
    console.log("Token:", localStorage.getItem('token'));
    
    if (!user) {
      alert("Please log in to place an order. If you are already logged in, please refresh the page.");
      return;
    }
    
    if (!customerInfo.phone || !customerInfo.address) {
      alert("Please provide phone and address for delivery");
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Calculate total price
      const basePrice = selection.base.price || 0;
      const saucePrice = selection.sauce.price || 0;
      const cheesePrice = selection.cheese.price || 0;
      const toppingsPrice = selection.toppings.reduce((sum, topping) => sum + (topping.price || 0), 0);
      const totalPrice = basePrice + saucePrice + cheesePrice + toppingsPrice;

      const orderData = {
        customer_email: user.email,
        customer_name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        customer_phone: customerInfo.phone,
        delivery_address: customerInfo.address,
        pizza_base: {
          id: selection.base._id,
          name: selection.base.name,
          price: selection.base.price
        },
        sauce: {
          id: selection.sauce._id,
          name: selection.sauce.name,
          price: selection.sauce.price
        },
        cheese: {
          id: selection.cheese._id,
          name: selection.cheese.name,
          price: selection.cheese.price
        },
        toppings: selection.toppings.map(topping => ({
          id: topping._id,
          name: topping.name,
          price: topping.price
        })),
        total_price: totalPrice,
        special_instructions: customerInfo.instructions || "",
        payment_method: "cash"
      };

      console.log("Sending order data:", orderData); // Debug log
      
      const result = await Order.create(orderData);
      console.log("Order created:", result); // Debug log
      
      // Update user info if changed
      const currentPhone = user.phoneNumber || '';
      const currentAddress = user.address || '';
      
      if (customerInfo.phone !== currentPhone || customerInfo.address !== currentAddress) {
        await User.updateMyUserData({
          phoneNumber: customerInfo.phone,
          address: customerInfo.address
        });
      }

      alert("Order placed successfully! You'll receive updates on the status.");
      setStep(5); // Success step
      
    } catch (error) {
      console.error("Error placing order:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert("Error placing order. Please try again.");
    }
    setIsPlacingOrder(false);
  };

  const steps = [
    { number: 1, title: "Choose Base", key: "base" },
    { number: 2, title: "Select Sauce", key: "sauce" },
    { number: 3, title: "Pick Cheese", key: "cheese" },
    { number: 4, title: "Add Toppings", key: "toppings" },
    { number: 5, title: "Order Details", key: "details" }
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
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center relative">
            {/* Progress line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full z-0">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-400 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
            
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center relative z-10">
                <motion.div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-all duration-300 ${
                    step >= s.number 
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white border-white shadow-lg scale-110' 
                      : step === s.number - 1
                      ? 'bg-white text-red-600 border-red-300 shadow-md'
                      : 'bg-gray-100 text-gray-400 border-gray-200'
                  }`}
                  whileHover={{ scale: step >= s.number ? 1.2 : 1.05 }}
                  animate={{ 
                    scale: step >= s.number ? 1.1 : 1,
                    boxShadow: step >= s.number ? "0 8px 25px rgba(239, 68, 68, 0.3)" : "0 4px 15px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {step > s.number ? <Check className="w-6 h-6" /> : s.number}
                </motion.div>
                <span className={`text-sm mt-3 text-center font-medium transition-colors ${
                  step >= s.number ? 'text-red-600' : 'text-gray-500'
                }`}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-center text-gray-900">Choose Your Pizza Base</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ingredients.bases.map((base) => (
                      <motion.div
                        key={base._id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-6 border-3 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl ${
                          selection.base?._id === base._id
                            ? 'border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-red-200 ring-4 ring-red-200'
                            : 'border-gray-200 hover:border-red-300 hover:bg-gradient-to-br hover:from-red-25 hover:to-orange-25 bg-white'
                        }`}
                        onClick={() => setSelection(prev => ({ ...prev, base }))}
                      >
                        {/* Selection indicator */}
                        {selection.base?._id === base._id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                        
                        {/* Pizza base icon */}
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-orange-200 rounded-full flex items-center justify-center border-4 border-amber-200">
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full border-2 border-amber-300"></div>
                        </div>
                        
                        <h3 className={`font-bold text-xl text-center mb-2 transition-colors ${
                          selection.base?._id === base._id ? 'text-red-700' : 'text-gray-900'
                        }`}>{base.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">{base.description}</p>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-lg ${
                            selection.base?.id === base.id ? 'text-red-600' : 'text-red-500'
                          }`}>${base.price.toFixed(2)}</span>
                          <Badge variant="outline" className={`${
                            base.stock < 10 
                              ? 'border-red-500 text-red-700 bg-red-50' 
                              : 'border-green-500 text-green-700 bg-green-50'
                          } font-medium`}>
                            {base.stock} left
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-8">
                    <Button 
                      onClick={() => setStep(2)} 
                      disabled={!selection.base}
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8 py-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Choose Sauce
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-center text-gray-900">Select Your Sauce</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ingredients.sauces.map((sauce) => (
                      <motion.div
                        key={sauce._id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-6 border-3 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl ${
                          selection.sauce?._id === sauce._id
                            ? 'border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-red-200 ring-4 ring-red-200'
                            : 'border-gray-200 hover:border-red-300 hover:bg-gradient-to-br hover:from-red-25 hover:to-orange-25 bg-white'
                        }`}
                        onClick={() => setSelection(prev => ({ ...prev, sauce }))}
                      >
                        {/* Selection indicator */}
                        {selection.sauce?._id === sauce._id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                        
                        {/* Sauce visual representation */}
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-200 shadow-inner relative overflow-hidden" 
                             style={{ 
                               background: sauce.name.includes('Tomato') ? 'linear-gradient(145deg, #dc2626, #b91c1c)' :
                                          sauce.name.includes('BBQ') ? 'linear-gradient(145deg, #92400e, #78350f)' :
                                          sauce.name.includes('White') ? 'linear-gradient(145deg, #f3f4f6, #e5e7eb)' :
                                          sauce.name.includes('Pesto') ? 'linear-gradient(145deg, #16a34a, #15803d)' :
                                          sauce.name.includes('Buffalo') ? 'linear-gradient(145deg, #ea580c, #c2410c)' :
                                          'linear-gradient(145deg, #dc2626, #b91c1c)'
                             }}>
                          <div className="absolute inset-2 rounded-full bg-white/20"></div>
                        </div>
                        
                        <h3 className={`font-bold text-xl text-center mb-2 transition-colors ${
                          selection.sauce?._id === sauce._id ? 'text-red-700' : 'text-gray-900'
                        }`}>{sauce.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">{sauce.description}</p>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-lg ${
                            selection.sauce?._id === sauce._id ? 'text-red-600' : 'text-red-500'
                          }`}>${sauce.price.toFixed(2)}</span>
                          <Badge variant="outline" className={`${
                            sauce.stock < 10 
                              ? 'border-red-500 text-red-700 bg-red-50' 
                              : 'border-green-500 text-green-700 bg-green-50'
                          } font-medium`}>
                            {sauce.stock} left
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(1)} className="px-6 py-3">
                      Previous
                    </Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      disabled={!selection.sauce}
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8 py-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Pick Cheese
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3" 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-center text-gray-900">Pick Your Cheese</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ingredients.cheeses.map((cheese) => (
                      <motion.div
                        key={cheese._id}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-6 border-3 rounded-2xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl ${
                          selection.cheese?._id === cheese._id
                            ? 'border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-red-200 ring-4 ring-red-200'
                            : 'border-gray-200 hover:border-red-300 hover:bg-gradient-to-br hover:from-red-25 hover:to-orange-25 bg-white'
                        }`}
                        onClick={() => setSelection(prev => ({ ...prev, cheese }))}
                      >
                        {/* Selection indicator */}
                        {selection.cheese?._id === cheese._id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </motion.div>
                        )}
                        
                        {/* Cheese visual representation */}
                        <div className="w-20 h-20 mx-auto mb-4 relative">
                          <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-orange-300 rounded-lg border-4 border-yellow-300 shadow-lg transform rotate-3">
                            <div className="absolute inset-2 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-lg"></div>
                            <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <div className="absolute bottom-4 right-3 w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                            <div className="absolute top-6 right-4 w-1 h-1 bg-yellow-400 rounded-full"></div>
                          </div>
                        </div>
                        
                        <h3 className={`font-bold text-xl text-center mb-2 transition-colors ${
                          selection.cheese?._id === cheese._id ? 'text-red-700' : 'text-gray-900'
                        }`}>{cheese.name}</h3>
                        <p className="text-gray-600 text-sm mb-4 text-center leading-relaxed">{cheese.description}</p>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-lg ${
                            selection.cheese?._id === cheese._id ? 'text-red-600' : 'text-red-500'
                          }`}>${cheese.price.toFixed(2)}</span>
                          <Badge variant="outline" className={`${
                            cheese.stock < 10 
                              ? 'border-red-500 text-red-700 bg-red-50' 
                              : 'border-green-500 text-green-700 bg-green-50'
                          } font-medium`}>
                            {cheese.stock} left
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(2)} className="px-6 py-3">
                      Previous
                    </Button>
                    <Button 
                      onClick={() => setStep(4)} 
                      disabled={!selection.cheese}
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8 py-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Add Toppings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold text-center text-gray-900">Add Your Toppings</CardTitle>
                  <p className="text-center text-gray-600">Select as many as you'd like!</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {ingredients.toppings.map((topping) => (
                      <motion.div
                        key={topping._id}
                        whileHover={{ scale: 1.05, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative p-4 border-3 rounded-xl cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl ${
                          selection.toppings.find(t => t._id === topping._id)
                            ? 'border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-red-200 ring-2 ring-red-200'
                            : 'border-gray-200 hover:border-red-300 hover:bg-gradient-to-br hover:from-red-25 hover:to-orange-25 bg-white'
                        }`}
                        onClick={() => handleToppingToggle(topping)}
                      >
                        {/* Selection indicator */}
                        {selection.toppings.find(t => t._id === topping._id) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg z-10"
                          >
                            <Check className="w-3 h-3 text-white" />
                          </motion.div>
                        )}
                        
                        {/* Topping visual representation */}
                        <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center border-3 border-green-200 shadow-md">
                          <div className={`w-8 h-8 rounded-full ${
                            topping.name.toLowerCase().includes('pepper') ? 'bg-gradient-to-br from-red-400 to-red-600' :
                            topping.name.toLowerCase().includes('mushroom') ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                            topping.name.toLowerCase().includes('onion') ? 'bg-gradient-to-br from-purple-300 to-purple-500' :
                            topping.name.toLowerCase().includes('olive') ? 'bg-gradient-to-br from-gray-700 to-gray-900' :
                            topping.name.toLowerCase().includes('tomato') ? 'bg-gradient-to-br from-red-400 to-red-600' :
                            'bg-gradient-to-br from-green-400 to-green-600'
                          }`}></div>
                        </div>
                        
                        <h4 className={`font-bold text-sm text-center mb-1 transition-colors ${
                          selection.toppings.find(t => t._id === topping._id) ? 'text-red-700' : 'text-gray-900'
                        }`}>{topping.name}</h4>
                        <p className="text-xs text-gray-600 text-center mb-2 leading-relaxed">{topping.description}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-bold ${
                            selection.toppings.find(t => t._id === topping._id) ? 'text-red-600' : 'text-red-500'
                          }`}>${topping.price.toFixed(2)}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs mt-1 w-full justify-center ${
                          topping.stock < 10 
                            ? 'border-red-500 text-red-700 bg-red-50' 
                            : 'border-green-500 text-green-700 bg-green-50'
                        }`}>
                          {topping.stock} left
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-8">
                    <Button variant="outline" onClick={() => setStep(3)} className="px-6 py-3">
                      Previous
                    </Button>
                    <div className="text-center bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-xl border-2 border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Selected toppings: {selection.toppings.length}</p>
                      <motion.p 
                        className="font-bold text-2xl text-red-600"
                        key={calculateTotal()}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        Total: ${calculateTotal().toFixed(2)}
                      </motion.p>
                    </div>
                    <Button 
                      onClick={() => setStep(5)} 
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8 py-3 shadow-lg hover:shadow-xl transition-all"
                    >
                      Review Order
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Base: {selection.base?.name}</span>
                      <span className="font-medium">${selection.base?.price.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Sauce: {selection.sauce?.name}</span>
                      <span className="font-medium">${selection.sauce?.price.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Cheese: {selection.cheese?.name}</span>
                      <span className="font-medium">${selection.cheese?.price.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <span className="font-medium">Toppings:</span>
                      {selection.toppings.map((topping) => (
                        <div key={topping._id} className="flex justify-between items-center text-sm">
                          <span>• {topping.name}</span>
                          <span>${topping.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-xl font-bold text-red-600">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Information */}
                <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">Delivery Information</CardTitle>
                    {/* Login Status Indicator */}
                    {user ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="text-sm">Logged in as {user.full_name || user.email}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <span className="text-sm">⚠️ You need to log in to place an order</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <Input
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                      <Textarea
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Your delivery address"
                        required
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                      <Textarea
                        value={customerInfo.instructions}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, instructions: e.target.value }))}
                        placeholder="Any special delivery instructions..."
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                      <Button variant="outline" onClick={() => setStep(4)} className="flex-1">
                        Back to Toppings
                      </Button>
                      <Button 
                        onClick={placeOrder} 
                        disabled={isPlacingOrder || !customerInfo.phone || !customerInfo.address}
                        className="flex-1 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600"
                      >
                        {isPlacingOrder ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Placing Order...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Place Order
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}