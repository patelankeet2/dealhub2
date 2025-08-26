import React, { useEffect, useState } from 'react';
import './AnalyticsPage.css';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AnalyticsPage = () => {
  const [chartData, setChartData] = useState(null);
  const [merchantEmail, setMerchantEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setMerchantEmail(user.email);
      } else {
        setMerchantEmail(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!merchantEmail) return;

    const fetchDeals = async () => {
      try {
        const q = query(collection(db, 'deals'), where('createdBy', '==', merchantEmail));
        const snapshot = await getDocs(q);
        const deals = snapshot.docs.map(doc => doc.data());

        const categoryCount = {};
        const dealLabels = [];
        const earningsData = [];
        let totalEarnings = 0;

        deals.forEach((deal) => {
          categoryCount[deal.category] = (categoryCount[deal.category] || 0) + 1;

          if (deal.approved) {
            const profit = deal.price * (1 - deal.discount / 100);
            const merchantEarning = profit * 0.95;
            totalEarnings += merchantEarning;
            dealLabels.push(deal.title);
            earningsData.push(merchantEarning);
          }
        });

        setChartData({
          totalDeals: deals.length,
          totalEarnings,
          categoryBar: {
            labels: Object.keys(categoryCount),
            datasets: [
              {
                label: 'Deals per Category',
                data: Object.values(categoryCount),
                backgroundColor: '#4f46e5',
              }
            ]
          },
          earningsLine: {
            labels: dealLabels,
            datasets: [
              {
                label: 'Earnings per Deal (after 5% fee)',
                data: earningsData,
                fill: true,
                borderColor: '#059669',
                backgroundColor: 'rgba(5,150,105,0.2)',
                tension: 0.4,
                pointBackgroundColor: '#059669'
              }
            ]
          }
        });
      } catch (error) {
        console.error('Error loading analytics:', error);
      }
    };

    fetchDeals();
  }, [merchantEmail]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e5e7eb' },
        title: {
          display: true,
          text: 'Count / Earnings ($)',
          color: '#374151',
          font: { weight: 'bold' }
        }
      },
      x: {
        grid: { display: false },
        title: {
          display: true,
          text: 'Categories / Deals',
          color: '#374151',
          font: { weight: 'bold' }
        }
      }
    }
  };

  return (
    <div className="analytics-page">
      <h2>📊 Deal Performance Analytics</h2>

      {!chartData ? (
        <p className="loading">Loading data...</p>
      ) : (
        <>
          <div className="summary-cards">
            <div className="summary-card">
              <h3>Total Deals</h3>
              <p>{chartData.totalDeals}</p>
            </div>
            <div className="summary-card">
              <h3>Total Earnings</h3>
              <p>${chartData.totalEarnings.toFixed(2)}</p>
              <span className="note">(* after 5% admin fee)</span>
            </div>
          </div>

          <div className="chart-section">
            <h4>📂 Deals by Category</h4>
            <div className="chart-wrapper">
              <Bar data={chartData.categoryBar} options={chartOptions} />
            </div>
          </div>

          <div className="chart-section">
            <h4>💰 Earnings per Deal</h4>
            <div className="chart-wrapper">
              <Line data={chartData.earningsLine} options={chartOptions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
