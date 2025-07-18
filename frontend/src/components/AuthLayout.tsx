import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">Concept Master</h1>
          <p className="text-sm text-gray-600">AI-powered learning for Class 1st to 12th</p>
        </div>

        {children}

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-sm">
            Back to <Link to="/" className="text-blue-600 hover:underline">home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

