import React, { useEffect, useState } from 'react';
import './CustomerProfilePage.css';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
 
const CustomerProfilePage = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    imageUrl: '',
  });
 
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
 
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfile({
          name: data.name || '',
          email: data.email || user.email,
          phone: data.phone || '',
          address: data.address || '',
          imageUrl: data.imageUrl || '',
        });
      }
    };
 
    fetchProfile();
  }, [user]);
 
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
 
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
 
    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      imageUrl: profile.imageUrl
    });
 
    alert('✅ Profile updated successfully!');
  };
 
  return (
    <div className="profile-page">
      <h2>🧑‍💼 Your Profile</h2>
 
      <form className="profile-form" onSubmit={handleSave}>
        <div className="profile-photo">
          {profile.imageUrl ? (
            <img src={profile.imageUrl} alt="Profile" />
          ) : (
            <div className="placeholder">No Image</div>
          )}
          <label>Photo URL</label>
          <input
            type="text"
            name="imageUrl"
            placeholder="Paste image URL here"
            value={profile.imageUrl}
            onChange={handleChange}
          />
        </div>
 
        <label>Name</label>
        <input name="name" value={profile.name} onChange={handleChange} required />
 
        <label>Email</label>
        <input value={profile.email} disabled />
 
        <label>Phone</label>
        <input name="phone" value={profile.phone} onChange={handleChange} />
 
        <label>Address</label>
        <textarea name="address" value={profile.address} onChange={handleChange} />
 
        <button type="submit">💾 Save Changes</button>
      </form>
    {/* Footer */}
    <footer className="footer">
        <p>© 2025 DealHub. All rights reserved.</p>
    </footer>
    </div>
  );
};
 
export default CustomerProfilePage;