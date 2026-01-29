import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "../lib/utils-app";
import { Pizza, ShoppingCart, Package, Settings, Users, Home, UserCircle, LogOut } from "lucide-react";
import { User } from "../entities/User";
import { useAuth } from "../context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "./ui/sidebar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const { user: authUser, logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.log("User not authenticated");
      }
    };
    loadUser();
  }, []);

  // Helper function to check if a route is active
  const isRouteActive = (itemUrl) => {
    if (itemUrl === '/') {
      return location.pathname === '/';
    }
    return location.pathname === itemUrl || location.pathname.startsWith(itemUrl + '/');
  };

  const customerNavigation = [
    {
      title: "Dashboard",
      url: createPageUrl("Dashboard"),
      icon: Home,
    },
    {
      title: "Build Pizza",
      url: createPageUrl("PizzaBuilder"),
      icon: Pizza,
    },
    {
      title: "My Orders",
      url: createPageUrl("Orders"),
      icon: ShoppingCart,
    },
    {
      title: "Profile",
      url: createPageUrl("Profile"),
      icon: UserCircle,
    },
  ];

  const adminNavigation = [
    {
      title: "Dashboard",
      url: createPageUrl("AdminDashboard"),
      icon: Home,
    },
    {
      title: "Inventory",
      url: createPageUrl("Inventory"),
      icon: Package,
    },
    {
      title: "Order Management",
      url: createPageUrl("OrderManagement"),
      icon: Settings,
    },
    {
      title: "Profile",
      url: createPageUrl("Profile"),
      icon: UserCircle,
    },
  ];

  const navigationItems = user?.role === "admin" ? adminNavigation : customerNavigation;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-red-50">
        <style>{`
          :root {
            --pizza-primary: #dc2626;
            --pizza-secondary: #ea580c;
            --pizza-accent: #f97316;
            --pizza-warm: #fed7aa;
            --pizza-cream: #fef3c7;
          }
        `}</style>
        
        <Sidebar className="border-r border-orange-200 bg-white/80 backdrop-blur-sm">
          <SidebarHeader className="border-b border-orange-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Pizza className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">PizzaMaster</h2>
                <p className="text-xs text-orange-600 font-medium">
                  {user?.role === "admin" ? "Admin Portal" : "Delicious Pizzas"}
                </p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-orange-700 uppercase tracking-wider px-2 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => {
                    const isActive = isRouteActive(item.url);
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-200 ${
                            isActive 
                              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' 
                              : 'text-gray-700 hover:bg-orange-100 hover:text-orange-800'
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-200 p-4">
            {user && (
              <div className="space-y-3">
                <Link to={createPageUrl("Profile")} className="flex items-center gap-3 px-2 hover:bg-orange-50 rounded-lg py-2 transition-all duration-200 cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : (user.firstName && user.lastName ? (user.firstName[0] + user.lastName[0]).toUpperCase() : 'U')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate capitalize">{user.role || 'User'}</p>
                  </div>
                </Link>
                
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      logout();
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-gray-600 hover:bg-gray-700 rounded-lg transition-all duration-200 font-medium text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/70 backdrop-blur-sm border-b border-orange-200 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-orange-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-bold text-gray-900">PizzaMaster</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}