import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders navigation links from Navbar', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Ensure guest links appear on initial render
  expect(screen.getByText(/login/i)).toBeInTheDocument();
  expect(screen.getByText(/register/i)).toBeInTheDocument();
});
