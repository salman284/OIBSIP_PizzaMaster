import React, { useState, useEffect } from "react";
import { PizzaBase, Sauce, Cheese, Topping, User } from "../entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { AlertTriangle, Package, Edit, Save, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Inventory() {
  const [inventory, setInventory] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    toppings: []
  });
  const [editingItems, setEditingItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadInventory = async () => {
      try {
        console.log('🔄 Loading inventory data...');
        const currentUser = await User.me();
        console.log('✅ User loaded:', currentUser);
        setUser(currentUser);

        // Handle nested user data format
        const userRole = currentUser?.role || currentUser?.user?.role;
        if (userRole !== 'admin') {
          alert("Access denied. Admin privileges required.");
          return;
        }

        console.log('🔄 Loading inventory entities...');
        const [bases, sauces, cheeses, toppings] = await Promise.all([
          PizzaBase.list().catch(err => { console.error('❌ PizzaBase failed:', err); return []; }),
          Sauce.list().catch(err => { console.error('❌ Sauce failed:', err); return []; }),
          Cheese.list().catch(err => { console.error('❌ Cheese failed:', err); return []; }),
          Topping.list().catch(err => { console.error('❌ Topping failed:', err); return []; })
        ]);

        console.log('📦 Inventory loaded:', { bases: bases.length, sauces: sauces.length, cheeses: cheeses.length, toppings: toppings.length });
        setInventory({ bases, sauces, cheeses, toppings });
      } catch (error) {
        console.error("Error loading inventory:", error);
      }
      setIsLoading(false);
    };

    loadInventory();
  }, []);

  const startEditing = (type, itemId, currentStock) => {
    setEditingItems(prev => ({
      ...prev,
      [`${type}-${itemId}`]: currentStock
    }));
  };

  const cancelEditing = (type, itemId) => {
    setEditingItems(prev => {
      const newState = { ...prev };
      delete newState[`${type}-${itemId}`];
      return newState;
    });
  };

  const saveStock = async (type, item) => {
    const itemId = item.id || item._id;
    const key = `${type}-${itemId}`;
    const newStock = editingItems[key];
    
    if (newStock === undefined || newStock === null || newStock === '') {
      alert("Please enter a valid stock number");
      return;
    }
    
    if (newStock < 0) {
      alert("Stock cannot be negative");
      return;
    }

    try {
      const EntityClass = {
        base: PizzaBase,
        bases: PizzaBase,
        sauce: Sauce,
        sauces: Sauce, 
        cheese: Cheese,
        cheeses: Cheese,
        topping: Topping,
        toppings: Topping
      }[type];

      if (!EntityClass) {
        throw new Error(`Unknown entity type: ${type}`);
      }

      await EntityClass.update(itemId, { stock: parseInt(newStock), stockQuantity: parseInt(newStock) });
      
      // Update local state
      setInventory(prev => ({
        ...prev,
        [`${type}s`]: prev[`${type}s`].map(i => 
          (i.id || i._id) === itemId ? { 
            ...i, 
            stock: parseInt(newStock),
            stockQuantity: parseInt(newStock)
          } : i
        )
      }));

      // Remove from editing
      cancelEditing(type, itemId);
    } catch (error) {
      console.error("Error updating stock:", error);
      alert(`Error updating stock: ${error.message}. Please try again.`);
    }
  };

  const InventoryTable = ({ items, type, title, icon: Icon }) => (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Icon className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items && items.length > 0 ? (
            items.map((item) => {
              const isEditing = editingItems[`${type}-${item.id || item._id}`] !== undefined;
              const isLowStock = (item.stock || item.stockQuantity || 0) <= (item.min_threshold || item.minThreshold || 0);
              
              return (
                <motion.div
                  key={item.id || item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border rounded-xl transition-all ${
                    isLowStock ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{item.name || 'Unknown Item'}</h3>
                        {isLowStock && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Low Stock
                          </Badge>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          <strong>Price:</strong> ${(item.price || 0).toFixed(2)}
                        </span>
                        <span className="text-gray-600">
                          <strong>Min Threshold:</strong> {item.min_threshold || 0}
                        </span>
                      </div>
                    </div>
                  
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <>
                        <Input
                          type="number"
                          min="0"
                          value={editingItems[`${type}-${item.id || item._id}`]}
                          onChange={(e) => setEditingItems(prev => ({
                            ...prev,
                            [`${type}-${item.id || item._id}`]: e.target.value
                          }))}
                          className="w-20 text-center"
                        />
                        <Button
                          size="sm"
                          onClick={() => saveStock(type, item)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelEditing(type, item.id || item._id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                            {item.stock || item.stockQuantity || 0}
                          </p>
                          <p className="text-xs text-gray-500">in stock</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(type, item.id || item._id, item.stock || item.stockQuantity || 0)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No {title.toLowerCase()} found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  // Debug user data
  console.log('🔍 Inventory user data for render check:', user);
  const userRole = user?.role || user?.user?.role;
  console.log('🔍 Inventory computed user role:', userRole);

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-8 flex items-center justify-center">
        <Card className="max-w-md bg-white/80 backdrop-blur-sm shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need admin privileges to access this page.</p>
            <p className="text-sm text-gray-500 mt-2">Your role: {userRole || 'undefined'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
          <p className="text-gray-600">Monitor and update your pizza ingredient stock levels</p>
        </motion.div>

        <Tabs defaultValue="bases" className="space-y-8">
          <TabsList className="bg-white/80 backdrop-blur-sm shadow-md border-0">
            <TabsTrigger value="bases" className="px-6 py-3">
              Pizza Bases ({inventory.bases.length})
            </TabsTrigger>
            <TabsTrigger value="sauces" className="px-6 py-3">
              Sauces ({inventory.sauces.length})
            </TabsTrigger>
            <TabsTrigger value="cheeses" className="px-6 py-3">
              Cheeses ({inventory.cheeses.length})
            </TabsTrigger>
            <TabsTrigger value="toppings" className="px-6 py-3">
              Toppings ({inventory.toppings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bases">
            <InventoryTable
              items={inventory.bases}
              type="base"
              title="Pizza Bases"
              icon={Package}
            />
          </TabsContent>

          <TabsContent value="sauces">
            <InventoryTable
              items={inventory.sauces}
              type="sauce"
              title="Sauces"
              icon={Package}
            />
          </TabsContent>

          <TabsContent value="cheeses">
            <InventoryTable
              items={inventory.cheeses}
              type="cheese"
              title="Cheeses"
              icon={Package}
            />
          </TabsContent>

          <TabsContent value="toppings">
            <InventoryTable
              items={inventory.toppings}
              type="topping"
              title="Toppings"
              icon={Package}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}