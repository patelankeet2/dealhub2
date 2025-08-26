import React, { useEffect, useState } from 'react';
import './Settings.css';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Settings = () => {
  const user = auth.currentUser;
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    license: '',
    photoURL: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          license: data.license || '',
          photoURL: data.photoURL || ''
        });
      }
    };
    loadProfile();
  }, [user]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        phone: formData.phone,
        license: formData.license,
        photoURL: formData.photoURL
      });

      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile.');
    }
  };

  return (
    <div className="settings-page">
      <h2>Merchant Profile</h2>

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="profile-pic">
          {formData.photoURL && (
            <img src={formData.photoURL} alt="Profile Preview" />
          )}
        </div>

        <label>Profile Picture URL</label>
        <input
          name="photoURL"
          value={formData.photoURL}
          onChange={handleChange}
          placeholder="https://example.com/your-photo.jpg"
        />

        <label>Name</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>Phone</label>
        <input name="phone" value={formData.phone} onChange={handleChange} />

        <label>NZ Driving License</label>
        <input name="license" value={formData.license} onChange={handleChange} />

        <button type="submit">Update Profile</button>
      </form>

      {message && <p className="success">{message}</p>}
    </div>
  );
};

export default Settings;
