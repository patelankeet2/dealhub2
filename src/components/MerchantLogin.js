import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MerchantLogin.css";
import logo from "../assets/logo.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const MerchantLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        setError("User not found.");
        return;
      }

      const userData = userDoc.data();

      if (userData.role !== "merchant") {
        setError("Access denied. Not a merchant account.");
        return;
      }

      if (!userData.isAuthorized) {
        setError("Your account is not authorized by admin yet.");
        return;
      }

      navigate("/merchant-dashboard");
    } catch (err) {
      console.error(err);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="merchant-login-container">
      <div className="merchant-login-wrapper">

        <div className="merchant-login-left">
          <img src={logo} alt="DealHub Logo" />
        </div>

        <div className="merchant-login-right">
          <h2>Welcome Merchant</h2>
          <p className="subtext">Sign in to access your dashboard</p>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Sign In</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <div className="auth-links">
            <a href="/merchant-forgot-password">Forgot Password?</a>
            <p>
              Don’t have an account? <a href="/merchant-register">Register</a>
            </p>
            <p>
              Switch to <a href="/login">Customer Login</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantLogin;
