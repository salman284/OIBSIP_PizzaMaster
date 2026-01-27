/**
 * PizzaMaster - A Modern Pizza Ordering Application
 * Copyright (c) 2025 Salman Alam Ostagar
 * Licensed under the MIT License
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import PizzaBuilder from './pages/PizzaBuilder'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import OrderManagement from './pages/OrderManagement'
import Inventory from './pages/Inventory'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  console.log('🚀 PizzaMaster App starting...');
  console.log('🌐 API URL:', import.meta.env.VITE_API_URL);
  console.log('🏠 Host:', typeof window !== 'undefined' ? window.location.hostname : 'SSR');
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout currentPageName="Dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/pizza-builder" element={
            <ProtectedRoute>
              <Layout currentPageName="Pizza Builder">
                <PizzaBuilder />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Layout currentPageName="My Orders">
                <Orders />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout currentPageName="Profile">
                <Profile />
              </Layout>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <Layout currentPageName="Admin Dashboard">
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/order-management" element={
            <ProtectedRoute adminOnly={true}>
              <Layout currentPageName="Order Management">
                <OrderManagement />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute adminOnly={true}>
              <Layout currentPageName="Inventory">
                <Inventory />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App