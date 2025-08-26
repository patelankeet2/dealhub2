import React, { useEffect, useState } from 'react';
import './OrderTrackingPage.css';
import { collection, getDocs, query, where, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { format } from 'date-fns';
 
const OrderTrackingPage = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
 
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
        const snapshot = await getDocs(q);
 
        const orderData = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            createdAt: data.createdAt?.toDate ? format(data.createdAt.toDate(), 'dd MMM yyyy, hh:mm a') : 'N/A',
            total: data.totalAmount || 0,
            shipping: data.shipping || {},
            cart: data.cart || [],
            status: data.status || 'Pending',
          };
        });
 
        setOrders(orderData);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
 
    fetchOrders();
  }, [user]);
 
  const filteredOrders = orders.filter(order => filter === 'All' || order.status === filter);
 
  const getStatusBadge = (status) => {
    const className = `status-badge ${status.toLowerCase()}`;
    return <span className={className}>{status}</span>;
  };
 
  const handleCancel = async (orderId) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: 'Cancelled' });
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: 'Cancelled' } : o))
      );
      alert('✅ Order cancelled');
    } catch (err) {
      alert('Error cancelling order');
    }
  };
 
  const handleReorder = async (order) => {
    try {
      await addDoc(collection(db, 'orders'), {
        ...order,
        createdAt: serverTimestamp(),
        status: 'Pending',
      });
      alert('🛒 Re-order placed!');
    } catch (err) {
      alert('Error placing re-order');
    }
  };
 
  return (
    <div className="tracking-page">
      <h2>Your Orders</h2>
 
      <div className="filter-tabs">
        {['All', 'Pending', 'Delivered', 'Cancelled'].map((type) => (
          <button
            key={type}
            className={filter === type ? 'active' : ''}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>
 
      {loading ? (
        <p className="loading">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="no-orders">No orders in this category.</p>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div className="order-card" key={order.id}>
              <h4>Order ID: {order.id}</h4>
              <p><strong>Date:</strong> {order.createdAt}</p>
              <p><strong>Name:</strong> {order.shipping.name}</p>
              <p><strong>Address:</strong> {order.shipping.address}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.cart.map((item, idx) => (
                  <li key={idx}>{item.title} - ${item.price} (-{item.discount}%)</li>
                ))}
              </ul>
              <p><strong>Total Paid:</strong> ${order.total}</p>
              <p><strong>Status:</strong> {getStatusBadge(order.status)}</p>
 
              <div className="order-actions">
                {order.status === 'Pending' && (
                  <button className="cancel-btn" onClick={() => handleCancel(order.id)}>
                    Cancel Order
                  </button>
                )}
                <button className="reorder-btn" onClick={() => handleReorder(order)}>
                  Re-order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    {/* Footer */}
    <footer className="footer">
      <p>© 2025 DealHub. All rights reserved.</p>
    </footer>
    </div>
  );
};
 
export default OrderTrackingPage;