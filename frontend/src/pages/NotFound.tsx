import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-gray-600 mt-4">Page not found</p>
        <a href="/" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
