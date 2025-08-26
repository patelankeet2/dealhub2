import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { useNavigate } from 'react-router-dom';
 
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    totalDeals: 0,
    approvedDeals: 0,
    totalEarnings: 0
  });
 
  const [adminProfile, setAdminProfile] = useState({ name: '', photo: '' });
  const [earningsData, setEarningsData] = useState([]);
 
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const dealsSnap = await getDocs(collection(db, 'deals'));
 
        let totalUsers = 0;
        let totalMerchants = 0;
        let totalDeals = 0;
        let approvedDeals = 0;
        let totalEarnings = 0;
 
        const earningsList = [];
 
        for (const docSnap of usersSnap.docs) {
          const user = docSnap.data();
          totalUsers++;
          if (user.role === 'merchant') totalMerchants++;
 
          if (docSnap.id === auth.currentUser?.uid) {
            setAdminProfile({
              name: user.name || 'Admin',
              photo: user.photo || '/default-avatar.png'
            });
          }
        }
 
        dealsSnap.forEach((doc) => {
          const deal = doc.data();
          totalDeals++;
          if (deal.approved) {
            approvedDeals++;
            const net = deal.price * (1 - deal.discount / 100);
            const commission = net * 0.05;
            totalEarnings += commission;
            earningsList.push({
              title: deal.title.length > 18 ? deal.title.slice(0, 15) + '...' : deal.title,
              commission: parseFloat(commission.toFixed(2))
            });
          }
        });
 
        setStats({
          totalUsers,
          totalMerchants,
          totalDeals,
          approvedDeals,
          totalEarnings
        });
 
        setEarningsData(
          earningsList.sort((a, b) => b.commission - a.commission).slice(0)
        );
 
      } catch (error) {
        console.error('Error loading admin dashboard:', error);
      }
    };
 
    fetchData();
  }, []);
 
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-greeting">
          <h2>{getGreeting()}, {adminProfile.name} 👋</h2>
          <p>Welcome back to your dashboard</p>
        </div>
        <img
          src={adminProfile.photo}
          alt="Admin Avatar"
          className="admin-avatar clickable"
          title="Go to Profile"
          onClick={() => navigate('/admin-profile')}
        />
      </div>
 
      <div className="admin-grid">
        <div className="admin-card"><p>Total Users</p><h3>{stats.totalUsers}</h3></div>
        <div className="admin-card"><p>Total Merchants</p><h3>{stats.totalMerchants}</h3></div>
        <div className="admin-card"><p>Total Deals</p><h3>{stats.totalDeals}</h3></div>
        <div className="admin-card"><p>Approved Deals</p><h3>{stats.approvedDeals}</h3></div>
        <div className="admin-card highlight"><p>Total Earnings (5%)</p><h3>${stats.totalEarnings.toFixed(2)}</h3></div>
      </div>
 
      <div className="admin-chart">
        <h3>📈 Earnings per Approved Deal</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={earningsData} margin={{ top: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="title"
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="commission" fill="#6366f1" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
 
      <footer className="footer">
        <p>© {new Date().getFullYear()} DealHub Admin Panel</p>
      </footer>
    </div>
  );
};
 
export default AdminDashboard;