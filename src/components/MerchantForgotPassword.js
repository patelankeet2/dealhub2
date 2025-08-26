import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MerchantForgotPassword.css";
import logo from "../assets/logo.png";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";

const MerchantForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (err) {
      console.error("Reset Error:", err.message);
      if (err.code === "auth/user-not-found") {
        setError("No user found with this email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else {
        setError("Failed to send reset link. Try again.");
      }
    }
  };

  return (
    <div className="merchant-forgot-container">
      <div className="merchant-forgot-wrapper">
        <div className="merchant-forgot-left">
          <img src={logo} alt="Deal Hub Logo" className="forgot-logo" />
        </div>

        <div className="merchant-forgot-right">
          <h2>Reset Your Password</h2>
          <p className="subtext">Enter your email to receive a reset link</p>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="merchant@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && <p className="forgot-error">{error}</p>}
              <button type="submit">Send Reset Link</button>
            </form>
          ) : (
            <div className="confirmation">
              ✅ A password reset link has been sent to <strong>{email}</strong>.
            </div>
          )}

          <div className="forgot-links">
            <p><a href="/merchant-login">Back to Login</a></p>
            <p><a href="/merchant-register">Register as a Merchant</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantForgotPassword;
