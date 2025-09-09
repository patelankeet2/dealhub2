// src/App.test.js
import { render, screen, within } from '@testing-library/react';
import App from './App';

// Mock AuthContext
jest.mock('./context/AuthContext', () => ({
  useAuth: () => ({
    user: null, // guest user
    role: null,
    loading: false,
  }),
  AuthProvider: ({ children }) => <>{children}</>,
}));

test('renders navigation links from Navbar for guest', () => {
  render(<App />);

  // Scope queries inside the navbar
  const navbar = screen.getByRole('navigation'); // selects <nav> element

  // Check links inside navbar only
  expect(within(navbar).getByText(/login/i)).toBeInTheDocument();
  expect(within(navbar).getByText(/register/i)).toBeInTheDocument();
  expect(within(navbar).getByText(/home/i)).toBeInTheDocument();
  expect(within(navbar).getByText(/deals/i)).toBeInTheDocument();
  expect(within(navbar).getByText(/cart/i)).toBeInTheDocument();
});
