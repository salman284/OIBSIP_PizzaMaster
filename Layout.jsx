import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "./src/lib/utils-app";
import { Pizza, ShoppingCart, Package, Settings, Users, Home, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { User } from "./src/entities/User";
import { useAuth } from "./src/context/AuthContext";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };

    if (isMobileSidebarOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileSidebarOpen]);

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

  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  const SidebarContent = ({ isMobile = false }) => (
    <>
      <div className={`border-b border-orange-200 p-6 ${isMobile ? 'flex items-center justify-between' : ''}`}>
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
        {isMobile && (
          <button 
            onClick={closeMobileSidebar}
            className="p-2 rounded-lg hover:bg-orange-100 transition-colors duration-200"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>
      
      <div className="p-4 flex-1">
        <div className="mb-4">
          <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider px-2 py-2">
            Navigation
          </p>
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <Link 
                  key={item.title}
                  to={item.url} 
                  onClick={isMobile ? closeMobileSidebar : undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-orange-100 hover:text-orange-800'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-orange-200 p-6">
        {(user || userData) && (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <Link 
                to={createPageUrl("Profile")} 
                onClick={isMobile ? closeMobileSidebar : undefined}
                className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg hover:from-orange-500 hover:to-red-500 transition-all duration-200 cursor-pointer"
              >
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

            {/* Logout Button */}
            <div className="flex justify-center">
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-sm font-medium w-full"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-orange-50 to-red-50">
      <style>{`
        :root {
          --pizza-primary: #dc2626;
          --pizza-secondary: #ea580c;
          --pizza-accent: #f97316;
          --pizza-warm: #fed7aa;
          --pizza-cream: #fef3c7;
        }

        /* Force hide desktop sidebar on mobile */
        @media (max-width: 767px) {
          .desktop-sidebar {
            display: none !important;
          }
          
          .main-content {
            margin-left: 0 !important;
          }
        }

        {/* Mobile sidebar animations */}
        @media (max-width: 767px) {
          .mobile-sidebar-overlay {
            background: linear-gradient(135deg, 
              rgba(220, 38, 38, 0.15) 0%,
              rgba(234, 88, 12, 0.15) 25%,
              rgba(249, 115, 22, 0.15) 50%,
              rgba(220, 38, 38, 0.20) 75%,
              rgba(147, 51, 234, 0.15) 100%
            );
            backdrop-filter: blur(2px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .mobile-sidebar {
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 
              0 25px 50px -12px rgba(220, 38, 38, 0.25),
              0 10px 25px -8px rgba(234, 88, 12, 0.15);
          }
          
          .mobile-sidebar.open {
            transform: translateX(0);
          }

          /* Add subtle animation to sidebar content */
          .mobile-sidebar-content {
            animation: slideInFromLeft 0.5s ease-out;
          }

          @keyframes slideInFromLeft {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* Enhanced gradient backdrop pattern */
          .mobile-sidebar-overlay::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(234, 88, 12, 0.2) 0%, transparent 50%);
            animation: floatingGradients 6s ease-in-out infinite alternate;
          }

          @keyframes floatingGradients {
            0% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        }

        /* Ensure mobile header is visible on mobile */
        @media (max-width: 767px) {
          .mobile-header {
            display: flex !important;
          }
        }

        /* Hide mobile header on desktop */
        @media (min-width: 768px) {
          .mobile-header {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="desktop-sidebar hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 bg-white/80 backdrop-blur-sm border-r border-orange-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-50 md:hidden"
          onClick={closeMobileSidebar}
        >
          <div className="absolute inset-0 mobile-sidebar-overlay" />
          <div 
            className={`absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-gradient-to-br from-white via-orange-50/95 to-red-50/95 border-r-2 border-orange-300 mobile-sidebar ${isMobileSidebarOpen ? 'open' : ''} flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-sidebar-content">
              <SidebarContent isMobile={true} />
            </div>
          </div>
        </div>
      )}

      <main className="main-content flex-1 flex flex-col md:ml-80">
        {/* Mobile Header - Only visible on mobile */}
        <header className="mobile-header bg-white/90 backdrop-blur-sm border-b border-orange-200 px-4 py-3 sticky top-0 z-40 md:hidden">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleMobileSidebarToggle}
                className="p-2 rounded-lg hover:bg-orange-100 transition-colors duration-200 touch-manipulation"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">PizzaMaster</h1>
            </div>
            
            {/* Mobile Quick Actions - Far Right */}
            <div className="flex items-center ml-auto">
              {/* Mobile Quick Logout */}
              <button 
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-100 transition-colors duration-200 touch-manipulation"
                aria-label="Logout"
              >
                <LogOut className="w-6 h-6 text-red-600" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}