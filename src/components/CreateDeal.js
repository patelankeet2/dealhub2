import React, { useState, useEffect } from 'react';
import './CreateDeal.css';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const CreateDeal = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    startDate: '',
    endDate: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categories'));
        const cats = snapshot.docs.map(doc => doc.data().name);
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert('Please login first.');
        navigate('/merchant-login');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      const merchantName = userData?.name || 'Unknown Merchant';

      const dealData = {
        ...form,
        price: parseFloat(form.price),
        discount: parseInt(form.discount),
        topDeal: false,
        approved: false,
        createdAt: serverTimestamp(),
        createdBy: user.email,
        createdByName: merchantName,
      };

      await addDoc(collection(db, 'deals'), dealData);
      alert('✅ Deal submitted successfully!');
      navigate('/merchant-dashboard');
    } catch (error) {
      console.error('❌ Submission error:', error.message);
      alert('Error submitting deal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="create-deal-container">
        <h2>Create New Deal</h2>
        <form className="deal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Deal Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Discount (%)</label>
            <input name="discount" type="number" value={form.discount} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Start Date</label>
            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              name="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={handleChange}
              required
            />
          </div>

          {form.imageUrl && (
            <div className="form-group image-preview-container">
              <label>Preview</label>
              <img
                src={form.imageUrl}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="save" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Deal'}
            </button>
          </div>
        </form>
      </div>

      <footer className="footer">
        <p>© 2025 DealHub. All rights reserved.</p>
      </footer>
    </>
  );
};

export default CreateDeal;
