// mocks must be declared at top-level so Jest will hoist them before imports
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({ user: null, role: null })
}));

jest.mock('../firebaseConfig', () => ({
  auth: { signOut: jest.fn(() => Promise.resolve()) }
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';

describe('Navbar component', () => {
  test('renders logo and guest links', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    // Logo
    expect(screen.getByText(/dealhub/i)).toBeInTheDocument();

    // Guest links
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/deals/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByText(/register/i)).toBeInTheDocument();
  });

  test('toggles menu when hamburger clicked', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );

    const menuButton = screen.getByText('☰');
    fireEvent.click(menuButton);

    const navLinks = document.querySelector('.nav-links');
    expect(navLinks).toBeTruthy();
    expect(navLinks.classList.contains('show')).toBe(true);
  });
});
