import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectAuthToken } from '../features/auth/authSlice';

const ProtectedRoute = () => {
  const token = useSelector(selectAuthToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;