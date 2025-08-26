import React, { useEffect, useState } from 'react';
import './CartPage.css';
import { useNavigate } from 'react-router-dom';
 
const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
 
  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const cartWithQty = cart.map(item => ({ ...item, quantity: item.quantity || 1 }));
      setCartItems(cartWithQty);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCartItems([]);
    }
  }, []);
 
  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };
 
  const handleRemove = (id) => {
    const filtered = cartItems.filter(item => item.id !== id);
    updateCart(filtered);
  };
 
  const handleQuantityChange = (id, delta) => {
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    );
    updateCart(updated);
  };
 
  const handleClearCart = () => {
    updateCart([]);
  };
 
  const handleProceed = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    navigate('/payment');
  };
 
  const total = cartItems.reduce((sum, item) => {
    const discounted = item.price * (1 - item.discount / 100);
    return sum + discounted * item.quantity;
  }, 0).toFixed(2);
 
  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
 
      <button className="back-to-deals" onClick={() => navigate('/deals')}>
        ⬅ Add More Deals
      </button>
 
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => {
              const discounted = (item.price * (1 - item.discount / 100)).toFixed(2);
              return (
                <div className="cart-item fade-in" key={item.id}>
                  <img src={item.imageUrl} alt={item.title} />
                  <div className="cart-details">
                    <h4>{item.title}</h4>
                    <p>Price: ${discounted}</p>
                    <div className="qty-controls">
                      <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                    </div>
                    <p>Subtotal: ${(discounted * item.quantity).toFixed(2)}</p>
                    <button className="remove-btn" onClick={() => handleRemove(item.id)}>Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
 
          <div className="cart-summary">
            <h3>Total: ${total}</h3>
            <div className="cart-actions">
              <button className="clear" onClick={handleClearCart}>Clear Cart</button>
              <button className="pay" onClick={handleProceed}>Proceed to Payment</button>
            </div>
          </div>
        </>
      )}
    {/* Footer */}
    <footer className="footer">
        <p>© 2025 DealHub. All rights reserved.</p>
    </footer>
    </div>
  );
};
 
export default CartPage;