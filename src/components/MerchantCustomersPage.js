import React, { useEffect, useState } from 'react';
import './MerchantCustomersPage.css';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { format } from 'date-fns';

const MerchantCustomersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const allOrders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const merchantOrders = [];

        allOrders.forEach(order => {
          const { cart = [], shipping = {}, createdAt } = order;

          cart.forEach(item => {
            if (item.merchantId === user.email) {
              merchantOrders.push({
                customerName: shipping.name,
                customerEmail: shipping.email || order.customerEmail,
                dealTitle: item.title,
                pricePaid: Math.floor(item.price * (1 - item.discount / 100)),
                createdAt: createdAt?.toDate ? format(createdAt.toDate(), 'dd MMM yyyy, hh:mm a') : 'N/A'
              });
            }
          });
        });

        setOrders(merchantOrders);
        setFilteredOrders(merchantOrders);
      } catch (error) {
        console.error('Error fetching customer orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    const filtered = orders.filter(order =>
      order.customerName.toLowerCase().includes(keyword) ||
      order.customerEmail.toLowerCase().includes(keyword) ||
      order.dealTitle.toLowerCase().includes(keyword)
    );
    setFilteredOrders(filtered);
  };

  return (
    <div className="merchant-customers-page">
      <h2>Customers Who Purchased Your Deals</h2>

      <input
        type="text"
        placeholder="Search by name, email, or deal..."
        className="search-input"
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? (
        <p>Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p>No matching customer purchases found.</p>
      ) : (
        <div className="table-wrapper">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Deal Title</th>
                <th>Paid ($)</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index}>
                  <td>{order.customerName}</td>
                  <td>{order.customerEmail}</td>
                  <td>{order.dealTitle}</td>
                  <td>${order.pricePaid}</td>
                  <td>{order.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MerchantCustomersPage;
