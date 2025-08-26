import React, { useState } from "react";
import "./MerchantRegister.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const MerchantRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    license: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        license: formData.license || null,
        role: "merchant",
        isAuthorized: false,
        createdAt: serverTimestamp()
      });

      alert("✅ Merchant registered! Please wait for admin approval.");
      navigate("/merchant-login");
    } catch (err) {
      console.error("Registration Error:", err.message);
      setError(err.message || "Failed to register.");
    }
  };

  return (
    <div className="merchant-register-container">
      <div className="merchant-register-wrapper">
        <div className="merchant-register-left">
          <img src={logo} alt="Deal Hub Logo" className="register-logo" />
        </div>

        <div className="merchant-register-right">
          <h2>Merchant Registration</h2>
          <p className="subtext">Create an account to publish and track your deals</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="license"
              placeholder="NZ Driving License (optional)"
              value={formData.license}
              onChange={handleChange}
            />

            {error && <p className="register-error">{error}</p>}

            <button type="submit">Register</button>
          </form>

          <div className="register-links">
            <p>Already a merchant? <a href="/merchant-login">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantRegister;
