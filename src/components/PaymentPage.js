import React, { useEffect, useState } from 'react';
import './PaymentPage.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { QRCodeCanvas } from 'qrcode.react';
 
const PaymentPage = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [cart, setCart] = useState([]);
  const [paid, setPaid] = useState(false);
 
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
 
  const [payment, setPayment] = useState({
    accountNumber: '',
    cvc: '',
    cardHolder: ''
  });
 
  useEffect(() => {
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(localCart);
    if (user) {
      setShipping((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);
 
  const handleShippingChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };
 
  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };
 
  const total = cart.reduce((sum, item) => {
    return sum + Math.floor(item.price * (1 - item.discount / 100));
  }, 0);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.phone || !shipping.address || !payment.accountNumber || !payment.cvc || !payment.cardHolder) {
      alert("Please fill in all fields.");
      return;
    }
 
    try {
      const cartWithMerchant = cart.map(item => ({
        ...item,
        merchantId: item.createdBy || "unknown"
      }));
 
      await addDoc(collection(db, 'orders'), {
        userId: user?.uid,
        customerEmail: user?.email,
        shipping,
        payment,
        cart: cartWithMerchant,
        totalAmount: total,
        paid: true,
        createdAt: serverTimestamp()
      });
 
      localStorage.removeItem('cart');
      setPaid(true);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("❌ Failed to process payment.");
    }
  };
 
  return (
    <div className="payment-page">
      <h2>Secure Checkout</h2>
 
      {paid ? (
        <div className="qr-section">
          <p className="thank-you">🎉 Thank you for your purchase!</p>
          <QRCodeCanvas value="https://dealhub-b48fa.web.app/feedback" size={160} />
          <p className="scan-text">📱 Scan this QR code to give feedback</p>
          <button className="feedback-btn" onClick={() => navigate('/feedback')}>
            Or Click Here to Give Feedback
          </button>
        </div>
      ) : (
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-section">
              <h3>Shipping Information</h3>
              <label>Name</label>
              <input name="name" value={shipping.name} onChange={handleShippingChange} required />
 
              <label>Email</label>
              <input type="email" name="email" value={shipping.email} disabled />
 
              <label>Phone</label>
              <input name="phone" value={shipping.phone} onChange={handleShippingChange} required />
 
              <label>Address</label>
              <textarea name="address" value={shipping.address} onChange={handleShippingChange} required />
            </div>
 
            <div className="form-section">
              <h3>Payment Information</h3>
              <label>Account Number</label>
              <input name="accountNumber" value={payment.accountNumber} onChange={handlePaymentChange} required maxLength={16} />
 
              <label>CVC</label>
              <input name="cvc" value={payment.cvc} onChange={handlePaymentChange} required maxLength={4} />
 
              <label>Card Holder Name</label>
              <input name="cardHolder" value={payment.cardHolder} onChange={handlePaymentChange} required />
            </div>
          </div>
 
          <div className="cart-summary">
            <h4>Total: ${total}</h4>
            <p>{cart.length} item(s)</p>
          </div>
 
          <button type="submit" className="pay-btn">Pay Now</button>
        </form>
      )}
    {/* Footer */}
    <footer className="footer">
        <p>© 2025 DealHub. All rights reserved.</p>
    </footer>
    </div>
  );
};
 
export default PaymentPage;