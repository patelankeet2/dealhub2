// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

/* eslint-disable no-console */

// 1) Silence React Router future-flag warnings in tests
const _origWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    const first = args && args[0] ? args[0].toString() : "";
    if (first.includes("React Router Future Flag Warning")) return;
    if (first.includes("Relative route resolution within Splat routes is changing")) return;
    _origWarn.apply(console, args);
  };
});

// 2) Jest mocks for Firebase SDK
jest.mock("firebase/auth", () => {
  return {
    signInWithEmailAndPassword: jest.fn(async () => {
      return { user: { uid: "test-uid" } };
    }),
    onAuthStateChanged: jest.fn((auth, cb) => {
      if (typeof cb === "function") cb(null); // simulate logged-out by default
      return () => {};
    }),
  };
});

jest.mock("firebase/firestore", () => {
  return {
    doc: jest.fn((db, col, id) => ({ _col: col, _id: id })),
    getDoc: jest.fn(async () => {
      return {
        exists: () => false,
        data: () => ({}),
      };
    }),
  };
});
