import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner text="Checking authentication" className="justify-center mb-4" />
          <p className="text-gray-400 text-sm">Please wait while we verify your session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return children;
};

export default ProtectedRoute;