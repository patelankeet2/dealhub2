import React, { useEffect, useState } from 'react';
import './AdminManageUsers.css';
import { collection, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
 
const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
 
  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      const userList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };
 
    fetchUsers();
  }, [refresh]);
 
  const handleApprove = async (userId) => {
    await updateDoc(doc(db, 'users', userId), { isAuthorized: true });
    setRefresh(prev => !prev);
  };
 
  const handleReject = async (userId) => {
    await updateDoc(doc(db, 'users', userId), { isAuthorized: false });
    setRefresh(prev => !prev);
  };
 
  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteDoc(doc(db, 'users', userId));
      setRefresh(prev => !prev);
    }
  };
 
  const filteredUsers = users.filter(
    user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
 
  return (
    <div className="manage-users-container">
      <h2>👥 Manage Users</h2>
 
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
 
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>License</th>
              <th>Authorized</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.role === 'merchant' ? (user.license || 'Not Provided') : 'N/A'}</td>
                <td>
                  {user.role === 'merchant'
                    ? user.isAuthorized ? '✅ Yes' : '❌ No'
                    : 'N/A'}
                </td>
                <td>
                  <div className="button-group">
                    {user.role === 'merchant' && (
                      <>
                        <button className="approve" onClick={() => handleApprove(user.id)}>Approve</button>
                        <button className="reject" onClick={() => handleReject(user.id)}>Reject</button>
                      </>
                    )}
                    <button className="delete" onClick={() => handleDelete(user.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <footer className="footer">
        <p>© 2025 DealHub Admin Panel</p>
      </footer>
    </div>
  );
};
 
export default AdminManageUsers;