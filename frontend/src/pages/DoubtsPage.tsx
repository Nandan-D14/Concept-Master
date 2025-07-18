import React from 'react';
import { Link } from 'react-router-dom';

const DoubtsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">My Doubts</h1>
          <Link
            to="/doubts/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Ask New Doubt
          </Link>
        </div>
        <p className="text-gray-600">
          View and manage your doubts. Get instant AI-powered answers or wait for expert responses.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center py-8">
          No doubts yet. Ask your first doubt to get started!
        </p>
      </div>
    </div>
  );
};

export default DoubtsPage;
