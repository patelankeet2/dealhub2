import React, { useEffect, useState } from 'react';
import './AdminProfile.css';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
 
const AdminProfile = () => {
  const userId = auth.currentUser?.uid;
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    photo: ''
  });
 
  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfile({
          name: data.name || '',
          email: data.email,
          role: data.role,
          photo: data.photo || ''
        });
      }
    };
 
    fetchProfile();
  }, [userId]);
 
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
 
  const handleSave = async () => {
    if (!userId) return;
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      name: profile.name,
      photo: profile.photo
    });
    alert('✅ Profile updated successfully!');
  };
 
  return (
    <div className="admin-profile-container">
      <div className="admin-profile-wrapper">
        <h2>🛠 Admin Profile Settings</h2>
 
        <div className="profile-card">
          <div className="image-preview">
            <img src={profile.photo || '/default-avatar.png'} alt="Admin" />
            <label htmlFor="photoUrl">Photo URL</label>
            <input
              type="text"
              name="photo"
              value={profile.photo}
              onChange={handleChange}
              placeholder="Paste image URL here"
            />
          </div>
 
          <div className="profile-details">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
 
            <label>Email</label>
            <input type="email" value={profile.email} disabled />
 
            <label>Role</label>
            <input type="text" value={profile.role} disabled />
 
            <button onClick={handleSave}>💾 Update Profile</button>
          </div>
        </div>
      </div>
 
      <footer className="footer">
        © {new Date().getFullYear()} DealHub Admin Panel
      </footer>
    </div>
  );
};
 
export default AdminProfile;