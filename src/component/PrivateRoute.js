// components/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem("token"); // Cek token di localStorage

  return (
    <Route
      {...rest}
      element={token ? element : <Navigate to="/login" replace />}
    />
  );
};

export default PrivateRoute;