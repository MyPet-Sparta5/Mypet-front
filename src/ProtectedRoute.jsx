import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('accessToken');
    const storedUserRole = localStorage.getItem('userRole');
    const isAuthenticated = !!token;
    const hasRequiredRole = allowedRoles.includes(storedUserRole);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (!hasRequiredRole) {
        return <Navigate to="/access-denied" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
