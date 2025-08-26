import React, { useEffect, useState } from 'react';
import './AdminManageCategory.css';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
 
const AdminManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editedName, setEditedName] = useState('');
 
  const fetchCategories = async () => {
    const snapshot = await getDocs(collection(db, 'categories'));
    const list = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name
    }));
    setCategories(list);
  };
 
  useEffect(() => {
    fetchCategories();
  }, []);
 
  const handleAdd = async () => {
    if (!newCat.trim()) return;
    await addDoc(collection(db, 'categories'), { name: newCat.trim() });
    setNewCat('');
    fetchCategories();
  };
 
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'categories', id));
    fetchCategories();
  };
 
  const handleEdit = async (id) => {
    await updateDoc(doc(db, 'categories', id), { name: editedName });
    setEditMode(null);
    fetchCategories();
  };
 
  return (
    <div className="admin-category-container">
      <h2>📂 Manage Deal Categories</h2>
 
      <div className="add-category">
        <input
          type="text"
          placeholder="Add new category"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button className="btn add" onClick={handleAdd}>Add</button>
      </div>
 
      <div className="category-table-wrapper">
        <table className="category-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id}>
                <td>
                  {editMode === cat.id ? (
                    <input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="edit-input"
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td>
                  {editMode === cat.id ? (
                    <>
                      <button className="btn save" onClick={() => handleEdit(cat.id)}>Save</button>
                      <button className="btn cancel" onClick={() => setEditMode(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn edit"
                        onClick={() => {
                          setEditMode(cat.id);
                          setEditedName(cat.name);
                        }}
                      >Edit</button>
                      <button className="btn delete" onClick={() => handleDelete(cat.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      <footer className="footer">
        <p>© {new Date().getFullYear()} DealHub Admin Panel</p>
      </footer>
    </div>
  );
};
 
export default AdminManageCategory;