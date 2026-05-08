import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAuthState } from '../api';

export default function ProtectedRoute({ allow, redirectTo, children }) {
  const location = useLocation();
  const authState = getAuthState();

  if (!authState.token) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  if (allow && authState.role !== allow) {
    return <Navigate to={redirectTo} replace state={{ from: location.pathname }} />;
  }

  return children;
}
