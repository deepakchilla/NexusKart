import "./App.css";
import React, { useState } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import UpdateProduct from "./components/UpdateProduct";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import Orders from "./components/Orders";
import Membership from "./components/Membership";
import Payment from "./components/Payment";
import AdminDashboard from "./components/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import AdminOrders from "./components/AdminOrders";
import { useContext } from "react";
import AppContext from "./Context/Context";
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AppContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

const LayoutWrapper = ({ children }) => {
  const location = useLocation();
  const hideNavFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <>
      {!hideNavFooter && <Navbar />}
      {children}
      {!hideNavFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Admin Routes with Isolated Layout */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/add_product" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AddProduct /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/product/update/:id" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><UpdateProduct /></AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute adminOnly>
              <AdminLayout><AdminOrders /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Consumer Routes */}
          <Route path="/product" element={<Product />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/category/:categoryName" element={<Home />} />
        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;
