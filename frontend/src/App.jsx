import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProductDetails from './pages/ProductDetails';
import Farmers from './pages/Farmers';
import FarmerProfile from './pages/FarmerProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CustomerDashboard from './pages/CustomerDashboard';
import SellerVerification from './pages/SellerVerification';
import UserProfile from './pages/UserProfile';
import UserSettings from './pages/UserSettings';
import UserOrders from './pages/UserOrders';
import ProtectedRoute from './components/ProtectedRoute';

// Seller Dashboard Pages
import FarmerDashboard from './pages/FarmerDashboard';
import SellerProfile from './pages/SellerProfile';
import EditFarmerProfile from './pages/EditFarmerProfile';
import SellerProducts from './pages/SellerProducts';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import SellerOrders from './pages/SellerOrders';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/farmer/:id" element={<FarmerProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/seller-verification" element={
              <ProtectedRoute>
                <SellerVerification />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/profile/settings" element={
              <ProtectedRoute>
                <UserSettings />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <UserOrders />
              </ProtectedRoute>
            } />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={
              <ProtectedRoute>
                <FarmerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/seller/profile" element={
              <ProtectedRoute>
                <SellerProfile />
              </ProtectedRoute>
            } />
            <Route path="/seller/profile/edit" element={
              <ProtectedRoute>
                <EditFarmerProfile />
              </ProtectedRoute>
            } />
            <Route path="/seller/products" element={
              <ProtectedRoute>
                <SellerProducts />
              </ProtectedRoute>
            } />
            <Route path="/seller/products/add" element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            } />
            <Route path="/seller/products/:productId/edit" element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            } />
            <Route path="/seller/orders" element={
              <ProtectedRoute>
                <SellerOrders />
              </ProtectedRoute>
            } />
            
            {/* Redirect legacy routes */}
            <Route path="/farmer-dashboard" element={<Navigate to="/seller/dashboard" replace />} />
            <Route path="/farmer/profile/edit" element={<Navigate to="/seller/profile/edit" replace />} />
            <Route path="/add-product" element={<Navigate to="/seller/products/add" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
