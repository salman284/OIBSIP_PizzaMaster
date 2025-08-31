import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./src/lib/utils-app";
import { Pizza, ShoppingCart, Package, Settings, Users, Home, LogOut, User as UserIcon } from "lucide-react";
import { User } from "./src/entities/User";
import { useAuth } from "./src/context/AuthContext";
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
} from "@/components/ui/sidebar";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          const fullUserData = await User.me();
          setUserData(fullUserData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      icon: UserIcon,
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
      icon: UserIcon,
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
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-orange-100 hover:text-orange-800 transition-all duration-200 rounded-xl mb-2 ${
                          location.pathname === item.url ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' : ''
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-orange-200 p-6">
            {(user || userData) && (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <Link 
                    to={createPageUrl("Profile")} 
                    className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg hover:from-orange-500 hover:to-red-500 transition-all duration-200 cursor-pointer"
                  >
                    {/* Avatar with user initials */}
                    {userData?.firstName || user?.firstName ? (
                      <span className="text-white font-bold text-lg">
                        {(userData?.firstName || user?.firstName || '').charAt(0).toUpperCase()}
                        {(userData?.lastName || user?.lastName || '').charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {`${userData?.firstName || user?.firstName || ''} ${userData?.lastName || user?.lastName || ''}`.trim() || 'User'}
                    </p>
                    <p className="text-xs text-orange-600 truncate capitalize">
                      {userData?.role || user?.role || 'Customer'}
                    </p>
                  </div>
                </div>

                {/* Logout Button Only */}
                <div className="flex justify-center">
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
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