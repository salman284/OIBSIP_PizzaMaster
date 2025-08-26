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
        const [bases, sauces, cheeses, toppings, currentUser] = await Promise.all([
          PizzaBase.list(),
          Sauce.list(),
          Cheese.list(), 
          Topping.list(),
          User.me()
        ]);
        
        setIngredients({ bases, sauces, cheeses, toppings });
        setUser(currentUser);
        
        if (currentUser.phone) setCustomerInfo(prev => ({ ...prev, phone: currentUser.phone }));
        if (currentUser.address) setCustomerInfo(prev => ({ ...prev, address: currentUser.address }));
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
      toppings: prev.toppings.find(t => t.id === topping.id)
        ? prev.toppings.filter(t => t.id !== topping.id)
        : [...prev.toppings, topping]
    }));
  };

  const placeOrder = async () => {
    if (!selection.base || !selection.sauce || !selection.cheese) {
      alert("Please complete your pizza selection");
      return;
    }
    
    if (!customerInfo.phone || !customerInfo.address) {
      alert("Please provide phone and address for delivery");
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderData = {
        customer_email: user.email,
        customer_name: user.full_name,
        customer_phone: customerInfo.phone,
        delivery_address: customerInfo.address,
        pizza_base: selection.base.name,
        sauce: selection.sauce.name,
        cheese: selection.cheese.name,
        toppings: selection.toppings.map(t => t.name),
        total_price: calculateTotal(),
        special_instructions: customerInfo.instructions,
        estimated_delivery: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
      };

      await Order.create(orderData);
      
      // Update user info if changed
      if (customerInfo.phone !== user.phone || customerInfo.address !== user.address) {
        await User.updateMyUserData({
          phone: customerInfo.phone,
          address: customerInfo.address
        });
      }

      alert("Order placed successfully! You'll receive updates on the status.");
      setStep(5); // Success step
      
    } catch (error) {
      console.error("Error placing order:", error);
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
          <div className="flex justify-between items-center">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= s.number 
                    ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                </div>
                <span className="text-xs mt-2 text-center font-medium">{s.title}</span>
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
                        key={base.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          selection.base?.id === base.id
                            ? 'border-red-600 bg-red-50 shadow-lg'
                            : 'border-gray-200 hover:border-red-300 hover:bg-red-25'
                        }`}
                        onClick={() => setSelection(prev => ({ ...prev, base }))}
                      >
                        {base.image_url && (
                          <img src={base.image_url} alt={base.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                        )}
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{base.name}</h3>
                        <p className="text-gray-600 text-sm mb-3">{base.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-red-600">${base.price.toFixed(2)}</span>
                          <Badge variant="outline" className={base.stock < base.min_threshold ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
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
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8"
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
                        key={sauce.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          selection.sauce?.id === sauce.id
                            ? 'border-red-600 bg-red-50 shadow-lg'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                        onClick={() => setSelection(prev => ({ ...prev, sauce }))}
                      >
                        <div className={`w-16 h-16 rounded-full mx-auto mb-4 border-4 border-gray-200`} 
                             style={{ backgroundColor: sauce.color || '#dc2626' }}>
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">{sauce.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 text-center">{sauce.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-red-600">${sauce.price.toFixed(2)}</span>
                          <Badge variant="outline" className={sauce.stock < sauce.min_threshold ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
                            {sauce.stock} left
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(1)}>Previous</Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      disabled={!selection.sauce}
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8"
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
                        key={cheese.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                          selection.cheese?.id === cheese.id
                            ? 'border-red-600 bg-red-50 shadow-lg'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                        onClick={() => setSelection(prev => ({ ...prev, cheese }))}
                      >
                        <h3 className="font-bold text-lg text-gray-900 mb-2 text-center">{cheese.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 text-center">{cheese.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-red-600">${cheese.price.toFixed(2)}</span>
                          <Badge variant="outline" className={cheese.stock < cheese.min_threshold ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}>
                            {cheese.stock} left
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-8">
                    <Button variant="outline" onClick={() => setStep(2)}>Previous</Button>
                    <Button 
                      onClick={() => setStep(4)} 
                      disabled={!selection.cheese}
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8"
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
                        key={topping.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selection.toppings.find(t => t.id === topping.id)
                            ? 'border-red-600 bg-red-50'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                        onClick={() => handleToppingToggle(topping)}
                      >
                        {topping.image_url && (
                          <img src={topping.image_url} alt={topping.name} className="w-12 h-12 object-cover rounded mx-auto mb-2" />
                        )}
                        <h4 className="font-medium text-sm text-gray-900 text-center mb-1">{topping.name}</h4>
                        <p className="text-xs text-gray-600 text-center mb-2">{topping.description}</p>
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-red-600">${topping.price.toFixed(2)}</span>
                          {selection.toppings.find(t => t.id === topping.id) && (
                            <Check className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <Badge variant="outline" className={`text-xs mt-1 ${topping.stock < topping.min_threshold ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'}`}>
                          {topping.stock} left
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-8">
                    <Button variant="outline" onClick={() => setStep(3)}>Previous</Button>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Selected toppings: {selection.toppings.length}</p>
                      <p className="font-bold text-lg text-red-600">Total: ${calculateTotal().toFixed(2)}</p>
                    </div>
                    <Button 
                      onClick={() => setStep(5)} 
                      className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 px-8"
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
                        <div key={topping.id} className="flex justify-between items-center text-sm">
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