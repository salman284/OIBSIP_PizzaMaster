# 🍕 PizzaMaster

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18.0.0-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-6.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-4.18.0-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>🎯 Craft Your Perfect Pizza with Premium Ingredients & Artisan Techniques</h3>
  <p><em>A modern, full-stack pizza ordering application with real-time inventory management and responsive design</em></p>
</div>

---

## 🌟 Features

### 🛒 **Customer Features**
- **🍕 Interactive Pizza Builder** - Customize your pizza with premium ingredients
- **📱 Responsive Design** - Seamless experience across all devices
- **🛍️ Order Management** - Track your orders in real-time
- **👤 User Profiles** - Manage your personal information and preferences
- **🎨 Modern UI** - Beautiful interface with smooth animations

### 🔧 **Admin Features**
- **📊 Admin Dashboard** - Comprehensive analytics and insights
- **📦 Inventory Management** - Real-time stock tracking and updates
- **📋 Order Management** - Process and track all customer orders
- **👥 User Management** - Role-based access control
- **📈 Revenue Tracking** - Monitor sales and performance metrics

### 📱 **Mobile Features**
- **🍔 Hamburger Navigation** - Intuitive mobile menu system
- **✨ Animated Sidebar** - Smooth slide-in navigation with attractive gradients
- **👆 Touch-Optimized** - Large touch targets for easy navigation
- **🔒 Quick Logout** - Accessible logout from mobile header
- **🎭 Visual Effects** - Premium animations and transitions

---

## 🚀 Tech Stack

### **Frontend**
- **React 18** - Modern React with Hooks and Context API
- **React Router** - Client-side routing and navigation
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions

### **Backend**
- **Node.js & Express** - RESTful API server
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT Authentication** - Secure user authentication
- **Bcrypt** - Password hashing and security
- **Role-based Authorization** - Admin and user access control

### **DevOps & Tools**
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and quality
- **Git** - Version control
- **Environment Variables** - Secure configuration management

---

## 📁 Project Structure

```
PizzaMaster/
├── 📂 backend/                 # Backend API server
│   ├── 📂 models/             # Database models
│   │   ├── User.js           # User model with roles
│   │   ├── Order.js          # Order management
│   │   ├── PizzaBase.js      # Pizza base options
│   │   ├── Sauce.js          # Sauce varieties
│   │   ├── Cheese.js         # Cheese options
│   │   └── Topping.js        # Topping selections
│   ├── 📂 routes/             # API endpoints
│   │   ├── auth.js           # Authentication routes
│   │   ├── orders.js         # Order management
│   │   ├── pizzaBases.js     # Pizza base CRUD
│   │   ├── sauces.js         # Sauce management
│   │   ├── cheeses.js        # Cheese management
│   │   └── toppings.js       # Topping management
│   ├── 📂 middleware/         # Custom middleware
│   │   └── auth.js           # JWT authentication
│   └── server.js             # Main server file
├── 📂 src/                    # Frontend React app
│   ├── 📂 components/         # Reusable components
│   │   └── ui/               # UI component library
│   ├── 📂 context/           # React Context providers
│   │   └── AuthContext.jsx   # Authentication state
│   ├── 📂 entities/          # API service classes
│   │   └── all.js           # Entity classes for API calls
│   ├── 📂 pages/             # Application pages
│   │   ├── Dashboard.jsx     # Customer dashboard
│   │   ├── PizzaBuilder.jsx  # Pizza customization
│   │   ├── Orders.jsx        # Order tracking
│   │   ├── AdminDashboard.jsx # Admin analytics
│   │   ├── Inventory.jsx     # Stock management
│   │   └── OrderManagement.jsx # Order processing
│   └── 📂 lib/               # Utility functions
├── Layout.jsx                # Main layout with navigation
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

---

## 🛠️ Installation & Setup

### **Prerequisites**
- Node.js (v18.0.0 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn package manager

### **1. Clone the Repository**
```bash
git clone https://github.com/salman284/OIBSIP_PizzaMaster.git
cd PizzaMaster
```

### **2. Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
MONGO_URI=mongodb://localhost:27017/pizzamaster
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
PORT=5000
```

### **3. Frontend Setup**
```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create environment file (if needed)
cp .env.example .env
```

### **4. Database Setup**
```bash
# Start MongoDB service
# On Windows: net start MongoDB
# On macOS: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# The application will automatically create collections
```

### **5. Start the Application**

**Backend (Terminal 1):**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend (Terminal 2):**
```bash
npm run dev
# App runs on http://localhost:5173
```

---

## 🎮 Usage Guide

### **Customer Journey**
1. **🔐 Register/Login** - Create account or sign in
2. **🏠 Dashboard** - View welcome page and featured pizzas
3. **🍕 Build Pizza** - Customize your perfect pizza
4. **🛒 Place Order** - Add delivery details and confirm
5. **📋 Track Orders** - Monitor order status in real-time

### **Admin Workflow**
1. **🔑 Admin Login** - Access with admin credentials
2. **📊 Dashboard** - View analytics, revenue, and alerts
3. **📦 Manage Inventory** - Update stock levels for ingredients
4. **📋 Process Orders** - Update order status and track delivery
5. **👥 User Management** - Monitor customer accounts

### **Mobile Experience**
1. **📱 Mobile Header** - Clean header with hamburger menu
2. **🍔 Navigation** - Tap hamburger to open sidebar
3. **✨ Smooth Animations** - Enjoy premium visual effects
4. **👆 Touch-Friendly** - Optimized for finger navigation

---

## 🔧 API Endpoints

### **Authentication**
```http
POST /api/auth/register     # User registration
POST /api/auth/login        # User authentication
GET  /api/auth/me          # Get current user
PUT  /api/auth/profile     # Update user profile
```

### **Orders**
```http
GET    /api/orders              # Get user orders
POST   /api/orders              # Create new order
GET    /api/orders/admin/all    # Get all orders (admin)
PUT    /api/orders/:id/status   # Update order status (admin)
```

### **Inventory**
```http
GET  /api/pizzabases        # Get pizza bases
PUT  /api/pizzabases/:id    # Update pizza base (admin)
GET  /api/sauces           # Get sauces
PUT  /api/sauces/:id       # Update sauce (admin)
GET  /api/cheeses          # Get cheeses
PUT  /api/cheeses/:id      # Update cheese (admin)
GET  /api/toppings         # Get toppings
PUT  /api/toppings/:id     # Update topping (admin)
```

---

## 🎨 Design Features

### **Color Palette**
- **Primary Red:** `#dc2626` - Main brand color
- **Secondary Orange:** `#ea580c` - Accent color
- **Warm Orange:** `#f97316` - Highlights
- **Soft Orange:** `#fed7aa` - Backgrounds
- **Cream:** `#fef3c7` - Light backgrounds

### **Responsive Breakpoints**
- **Mobile:** `< 768px` - Full mobile experience
- **Tablet:** `768px - 1024px` - Hybrid layout
- **Desktop:** `> 1024px` - Full sidebar layout

### **Animations**
- **Smooth Transitions** - 0.3s ease-in-out
- **Hover Effects** - Interactive feedback
- **Loading States** - User-friendly waiting
- **Mobile Gestures** - Touch-optimized interactions

---

## 🔒 Security Features

- **🔐 JWT Authentication** - Secure token-based auth
- **🔒 Password Hashing** - Bcrypt encryption
- **👮 Role-based Access** - Admin and user permissions
- **🛡️ Input Validation** - Server-side validation
- **🚫 CORS Protection** - Cross-origin security

---

## 📱 Mobile Optimizations

- **📐 Responsive Design** - Works on all screen sizes
- **👆 Touch Targets** - Minimum 44px for easy tapping
- **🎭 Visual Feedback** - Hover and active states
- **🔄 Auto-close Sidebar** - Smart navigation behavior
- **⌨️ Keyboard Support** - Accessibility features

---

## 🚀 Performance Features

- **⚡ Fast Loading** - Optimized bundle sizes
- **🔄 Lazy Loading** - Components loaded on demand
- **💾 Efficient Caching** - Smart data management
- **📊 Optimized Images** - Compressed assets
- **🎯 Code Splitting** - Reduced initial load

---

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to branch** (`git push origin feature/AmazingFeature`)
5. **Open Pull Request**

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Sk Salman Alam Ostagar**
- 🌐 GitHub: [@salman284](https://github.com/salman284)
- 📧 Email: salmanalamostagar@gmail.com
- 💼 LinkedIn: [Sk Salman Alam Ostagar](www.linkedin.com/in/sk-salman-alam-ostagar-8702a4290)

---

## 🙏 Acknowledgments

- **🎨 Design Inspiration** - Modern pizza restaurant websites
- **🛠️ Technology Stack** - React, Node.js, MongoDB community
- **📱 Mobile UX** - Best practices from leading mobile apps
- **🎭 Animations** - Framer Motion documentation and examples

---

<div align="center">
  <h3>🍕 Made with ❤️ for Pizza Lovers Everywhere 🍕</h3>
  <p><em>Enjoy crafting your perfect pizza experience!</em></p>
</div>
