// Utility functions for the application

export function createPageUrl(pageName) {
  const routes = {
    Dashboard: "/",
    PizzaBuilder: "/pizza-builder", 
    Orders: "/orders",
    AdminDashboard: "/admin-dashboard",
    OrderManagement: "/order-management",
    Inventory: "/inventory"
  };
  
  return routes[pageName] || "/";
}
