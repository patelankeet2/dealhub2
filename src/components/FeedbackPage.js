import React, { useState } from 'react';
import './FeedbackPage.css';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
 
const FeedbackPage = () => {
  const [form, setForm] = useState({
    name: '',
    comment: '',
    rating: '5',
  });
 
  const [submitted, setSubmitted] = useState(false);
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      await addDoc(collection(db, 'feedback'), {
        ...form,
        createdAt: serverTimestamp(),
      });
 
      setSubmitted(true);
    } catch (err) {
      alert('Error submitting feedback: ' + err.message);
    }
  };
 
  return (
    <div className="feedback-page">
      <h2>We Value Your Feedback</h2>
 
      {submitted ? (
        <div className="thank-you">
          <p>✅ Thank you for sharing your feedback!</p>
        </div>
      ) : (
        <form className="feedback-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
 
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              required
            >
              <option value="5">★★★★★ - Excellent</option>
              <option value="4">★★★★ - Good</option>
              <option value="3">★★★ - Average</option>
              <option value="2">★★ - Poor</option>
              <option value="1">★ - Bad</option>
            </select>
          </div>
 
          <div className="form-group">
            <label htmlFor="comment">Comment</label>
            <textarea
              id="comment"
              name="comment"
              placeholder="Write your experience..."
              value={form.comment}
              onChange={handleChange}
              required
            />
          </div>
 
          <button type="submit">Submit Feedback</button>
        </form>
      )}
 
      {/* Footer */}
      <footer className="footer">
        <p>© 2025 DealHub. All rights reserved.</p>
      </footer>
    </div>
  );
};
 
export default FeedbackPage;