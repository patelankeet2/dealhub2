import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/logo.png';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
 
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { email, password } = formData;
 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
 
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
 
      if (!userDoc.exists()) {
        setError('User profile not found.');
        return;
      }
 
      const role = userDoc.data()?.role?.toLowerCase();
      if (role === 'customer') {
        navigate('/landing');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        setError('Unauthorized access.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };
 
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <img src={logo} alt="DealHub Logo" className="login-logo" />
        </div>
        <div className="login-right">
          <h2>Welcome Back</h2>
          <p className="subtext">Sign in to access your dashboard</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button type="submit">Sign In</button>
          </form>
          {error && <p className="login-error">{error}</p>}
          <div className="login-links">
            <a href="/forgot-password">Forgot Password?</a>
            <p>Don’t have an account? <a href="/register">Register</a></p>
            <p>Switch to <a href="/merchant-login">Merchant Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Login;