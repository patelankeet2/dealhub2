import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../assets/logo.png';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
 
function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState('');
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
 
    const { name, email, password, confirmPassword } = formData;
 
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
 
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "customer"
      });
 
      navigate('/login');
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };
 
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-left">
          <img src={logo} alt="DealHub Logo" className="login-logo" />
        </div>
        <div className="login-right">
          <h2>Create Account</h2>
          <p className="subtext">Enter your details to get started</p>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            <button type="submit">Register</button>
          </form>
          {error && <p className="login-error">{error}</p>}
          <div className="login-links">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Register;