import React, { useEffect, useState } from 'react';
import './DealDetailsPage.css';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { getDownloadURL, ref } from 'firebase/storage';
 
const DealDetailsPage = () => {
  const { dealId } = useParams();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const docRef = doc(db, 'deals', dealId);
        const snapshot = await getDoc(docRef);
 
        if (snapshot.exists()) {
          const data = snapshot.data();
          let imageUrl = '';
 
          if (data.imageUrl) {
            imageUrl = data.imageUrl;
          } else if (data.imagePath) {
            imageUrl = await getDownloadURL(ref(storage, data.imagePath));
          }
 
          setDeal({ ...data, imageUrl });
        } else {
          console.warn('Deal not found');
        }
      } catch (error) {
        console.error('Error fetching deal details:', error);
      } finally {
        setLoading(false);
      }
    };
 
    fetchDeal();
  }, [dealId]);
 
  const handleAddToCart = () => {
    const existing = JSON.parse(localStorage.getItem('cart')) || [];
    existing.push({ ...deal, id: dealId });
    localStorage.setItem('cart', JSON.stringify(existing));
    alert('✅ Deal added to cart!');
    navigate('/cart');
  };
 
  const handleBack = () => {
    navigate('/deals');
  };
 
  if (loading) return <div className="deal-details-loading">Loading...</div>;
  if (!deal) return <div className="deal-details-error">Deal not found.</div>;
 
  const discountedPrice = Math.floor(deal.price * (1 - deal.discount / 100));
 
  return (
    <div className="deal-details-page">
      <button className="back-button" onClick={handleBack}>← Back to Deals</button>
 
      <div className="deal-details-container">
        <img src={deal.imageUrl} alt={deal.title} className="deal-image" />
        <div className="deal-info">
          <h2>{deal.title}</h2>
          <p className="price-info">
            <span className="old-price">${deal.price}</span>
            <span className="new-price">${discountedPrice}</span>
          </p>
          <p className="description">{deal.description}</p>
          <p><strong>Category:</strong> {deal.category}</p>
          <p><strong>Valid:</strong> {deal.startDate} to {deal.endDate}</p>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    {/* Footer */}
    <footer className="footer">
        <p>© 2025 DealHub. All rights reserved.</p>
    </footer>
    </div>
  );
};
 
export default DealDetailsPage;