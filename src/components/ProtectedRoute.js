import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const { user, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(role)) return <Navigate to="/landing" />;

  return <Component />;
};

export default ProtectedRoute;
