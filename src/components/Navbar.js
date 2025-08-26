import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebaseConfig';
import './Navbar.css';

const Navbar = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut().then(() => {
      navigate('/login');
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="main-navbar">
      <div className="navbar-header">
        <div className="logo" onClick={() => navigate('/')}>DealHub</div>
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
      </div>

      <div className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
        {!user && (
          <>
            <Link to="/landing">Home</Link>
            <Link to="/deals">Deals</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && role === 'customer' && (
          <>
            <Link to="/landing">Home</Link>
            <Link to="/deals">Deals</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/profile">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}

        {user && role === 'merchant' && (
          <>
            <Link to="/merchant-dashboard">Dashboard</Link>
            <Link to="/create-deal">Create Deal</Link>
            <Link to="/analytics">Analytics</Link>
            <Link to="/merchant-deals">My Deals</Link>
            <Link to="/merchant-customers">Customers</Link>
            <Link to="/settings">Settings</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}

        {user && role === 'admin' && (
          <>
            <Link to="/admin-dashboard">Dashboard</Link>
            <Link to="/admin-manage-users">Manage Users</Link>
            <Link to="/admin-manage-deals">Manage Deals</Link>
            <Link to="/admin-manage-category">Manage Category</Link>
            <Link to="/admin-earnings">Earnings</Link>
            <Link to="/admin-profile">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
