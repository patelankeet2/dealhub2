import React, { useEffect, useState } from 'react';
import './AdminManageDeals.css';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
 
const AdminManageDeals = () => {
  const [deals, setDeals] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
 
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'deals'));
        const dealList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setDeals(dealList);
      } catch (err) {
        console.error('Error fetching deals:', err);
      }
    };
 
    fetchDeals();
  }, [refresh]);
 
  const handleApprove = async (id) => {
    await updateDoc(doc(db, 'deals', id), { approved: true });
    setRefresh(prev => !prev);
  };
 
  const handleReject = async (id) => {
    await updateDoc(doc(db, 'deals', id), { approved: false });
    setRefresh(prev => !prev);
  };
 
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'deals', id));
    setRefresh(prev => !prev);
  };
 
  const toggleTopDeal = async (id, currentStatus) => {
    await updateDoc(doc(db, 'deals', id), { topDeal: !currentStatus });
    setRefresh(prev => !prev);
  };
 
  const filteredDeals = deals.filter(deal =>
    deal.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.createdByName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <div className="admin-deals-container">
      <h2>🎯 Admin Deal Management</h2>
 
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title, category, or merchant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
 
      <div className="responsive-table">
        <table className="deals-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Price ($)</th>
              <th>Merchant</th>
              <th>Status</th>
              <th>Top Deal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map(deal => (
              <tr key={deal.id}>
                <td>{deal.title}</td>
                <td>{deal.category}</td>
                <td>${deal.price}</td>
                <td>{deal.createdByName || deal.createdBy || 'N/A'}</td>
                <td>
                  <span className={`status ${deal.approved ? 'approved' : 'pending'}`}>
                    {deal.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td>
                  <span className={deal.topDeal ? 'top-yes' : 'top-no'}>
                    {deal.topDeal ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="action-btns">
                  <button className="approve" onClick={() => handleApprove(deal.id)}>✅</button>
                  <button className="reject" onClick={() => handleReject(deal.id)}>⛔</button>
                  <button className="toggle-top" onClick={() => toggleTopDeal(deal.id, deal.topDeal)}>
                    {deal.topDeal ? 'Unset' : 'Set'}
                  </button>
                  <button className="delete" onClick={() => handleDelete(deal.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <footer className="footer">
        <p>© 2025 DealHub Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
};
 
export default AdminManageDeals;