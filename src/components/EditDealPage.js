import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CreateDeal.css';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const EditDealPage = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    category: '',
    startDate: '',
    endDate: '',
    imageUrl: ''
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDeal = async () => {
      try {
        const docRef = doc(db, 'deals', dealId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          setForm(snapshot.data());
        } else {
          alert('Deal not found.');
          navigate('/merchant-dashboard');
        }
      } catch (error) {
        console.error('Error loading deal:', error);
        alert('Error loading deal');
      }
    };

    const fetchCategories = async () => {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        const catList = snap.docs.map(doc => doc.data().name);
        setCategories(catList);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    fetchDeal();
    fetchCategories();
  }, [dealId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'deals', dealId), {
        ...form,
        price: parseFloat(form.price),
        discount: parseInt(form.discount),
      });
      alert('✅ Deal updated successfully!');
      navigate('/merchant-dashboard');
    } catch (err) {
      console.error('Error updating deal:', err);
      alert('Error updating deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-deal-container">
      <h2>Edit Deal</h2>
      <form className="deal-form" onSubmit={handleUpdate}>
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
            {loading ? 'Updating...' : 'Update Deal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDealPage;
