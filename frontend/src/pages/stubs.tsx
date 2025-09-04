import React from 'react';
import { useParams } from 'react-router-dom';

// TestViewer
export const TestViewer: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Viewer</h1>
      <p>Taking test with ID: {id}</p>
    </div>
  );
};

// Profile
export const Profile: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile</h1>
      <p className="text-gray-600">Manage your profile and preferences</p>
    </div>
  );
};

// Leaderboard
export const Leaderboard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Leaderboard</h1>
      <p className="text-gray-600">See top performers in your class</p>
    </div>
  );
};

// Settings
export const Settings: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
      <p className="text-gray-600">Configure your application settings</p>
    </div>
  );
};

// NotFound
export const NotFound: React.FC = () => {
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