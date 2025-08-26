import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import DealsPage from './components/DealsPage';
import DealDetailsPage from './components/DealDetailsPage';
import CartPage from './components/CartPage';
import PaymentPage from './components/PaymentPage';
import FeedbackPage from './components/FeedbackPage';
import OrderTrackingPage from './components/OrderTrackingPage';
import CustomerProfilePage from './components/CustomerProfilePage';

import MerchantLogin from './components/MerchantLogin';
import MerchantRegister from './components/MerchantRegister';
import MerchantDashboard from './components/MerchantDashboard';
import CreateDeal from './components/CreateDeal';
import AnalyticsPage from './components/AnalyticsPage';
import Settings from './components/Settings';
import MerchantForgotPassword from './components/MerchantForgotPassword';
import MerchantDealsPage from './components/MerchantDealsPage';
import MerchantCustomersPage from './components/MerchantCustomersPage';

import AdminDashboard from './components/AdminDashboard';
import AdminManageUsers from './components/AdminManageUsers';
import AdminManageDeals from './components/AdminManageDeals';
import AdminManageCategory from './components/AdminManageCategory';
import AdminEarnings from './components/AdminEarnings';
import AdminProfile from './components/AdminProfile';

import CustomerForgotPassword from './components/CustomerForgotPassword';
import Navbar from './components/Navbar';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import EditDealPage from './components/EditDealPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/deal/:dealId" element={<DealDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/merchant-login" element={<MerchantLogin />} />
          <Route path="/merchant-register" element={<MerchantRegister />} />
          <Route path="/merchant-forgot-password" element={<MerchantForgotPassword />} />
          <Route path="/forgot-password" element={<CustomerForgotPassword />} />
          <Route path="/feedback" element={<FeedbackPage />} />

          {/* Protected routes for customer */}
          <Route path="/payment" element={<ProtectedRoute element={PaymentPage} allowedRoles={['customer']} />} />
          <Route path="/orders" element={<ProtectedRoute element={OrderTrackingPage} allowedRoles={['customer']} />} />
          <Route path="/profile" element={<ProtectedRoute element={CustomerProfilePage} allowedRoles={['customer']} />} />

          {/* Protected routes for merchant */}
          <Route path="/merchant-dashboard" element={<ProtectedRoute element={MerchantDashboard} allowedRoles={['merchant']} />} />
          <Route path="/create-deal" element={<ProtectedRoute element={CreateDeal} allowedRoles={['merchant']} />} />
          <Route path="/analytics" element={<ProtectedRoute element={AnalyticsPage} allowedRoles={['merchant']} />} />
          <Route path="/settings" element={<ProtectedRoute element={Settings} allowedRoles={['merchant']} />} />
          <Route path="/merchant-deals" element={<ProtectedRoute element={MerchantDealsPage} allowedRoles={['merchant']} />} />
          <Route path="/edit-deal/:dealId" element={<ProtectedRoute element={EditDealPage} allowedRoles={['merchant']}/>} />
          <Route path="/merchant-customers" element={<ProtectedRoute element={MerchantCustomersPage} allowedRoles={['merchant']} />} />

          {/* Protected routes for admin */}
          <Route path="/admin-dashboard" element={<ProtectedRoute element={AdminDashboard} allowedRoles={['admin']} />} />
          <Route path="/admin-manage-users" element={<ProtectedRoute element={AdminManageUsers} allowedRoles={['admin']} />} />
          <Route path="/admin-manage-deals" element={<ProtectedRoute element={AdminManageDeals} allowedRoles={['admin']} />} />
          <Route path="/admin-manage-category" element={<ProtectedRoute element={AdminManageCategory} allowedRoles={['admin']} />} />
          <Route path="/admin-earnings" element={<ProtectedRoute element={AdminEarnings} allowedRoles={['admin']} />} />
          <Route path="/admin-profile" element={<ProtectedRoute element={AdminProfile} allowedRoles={['admin']} />} />

          {/* 404 fallback */}
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
