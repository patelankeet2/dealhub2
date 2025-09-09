// src/setupTests.js

// jest-dom adds custom jest matchers for asserting on DOM nodes
import '@testing-library/jest-dom';

// ------------------
// Silence warnings and errors
// ------------------
const _origWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    const first = args && args[0] ? args[0].toString() : "";
    if (
      first.includes("React Router Future Flag Warning") ||
      first.includes("Relative route resolution within Splat routes is changing")
    ) return;
    _origWarn.apply(console, args);
  };

  // Silence console.error for fetchDeals errors
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

// ------------------
// App Context Mock
// ------------------
jest.mock('./context/AuthContext', () => ({
  useAuth: () => ({ user: null, role: null }),
}));

// ------------------
// Firebase Config Mock
// ------------------
jest.mock('./firebaseConfig', () => ({
  auth: { signOut: async () => Promise.resolve() },
}));

// ------------------
// Mock Firebase Auth
// ------------------
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'test-uid' } }),
  onAuthStateChanged: (auth, cb) => {
    if (typeof cb === 'function') cb({ uid: 'test-uid' });
    return () => {};
  },
}));

// ------------------
// Mock Firebase Firestore
// ------------------
jest.mock('firebase/firestore', () => ({
  doc: (db, col, id) => ({ _col: col, _id: id }),
  getDoc: () =>
    Promise.resolve({
      exists: () => true,
      data: () => ({ name: 'Test User', role: 'customer', imageUrl: '' }),
    }),
  collection: jest.fn(),
  query: () => ({}),
  where: jest.fn(),
  getDocs: () =>
    Promise.resolve({
      docs: [
        {
          id: 'deal-1',
          data: () => ({
            title: 'Test Deal',
            price: 100,
            discount: 10,
            topDeal: true,
            approved: true,
            imageUrl: 'https://fakeurl.com/image.jpg',
          }),
        },
      ],
    }),
}));

// ------------------
// Mock Firebase Storage
// ------------------
jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  getDownloadURL: () => Promise.resolve('https://fakeurl.com/fakeimage.jpg'),
}));
