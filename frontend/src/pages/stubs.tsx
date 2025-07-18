import React from 'react';
import { useParams } from 'react-router-dom';

// TestsPage
export const TestsPage: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Tests & Assessments</h1>
      <p className="text-gray-600">Practice with mock tests and quizzes</p>
    </div>
  );
};

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

// AITools
export const AITools: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">AI Tools</h1>
      <p className="text-gray-600">AI-powered learning assistance</p>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Text Simplifier</h3>
          <p className="text-sm text-gray-600">Simplify complex text</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Concept Explainer</h3>
          <p className="text-sm text-gray-600">Get detailed explanations</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Question Generator</h3>
          <p className="text-sm text-gray-600">Generate practice questions</p>
        </div>
        <div className="p-4 border rounded-lg">
          <h3 className="font-semibold">Study Planner</h3>
          <p className="text-sm text-gray-600">Create study schedules</p>
        </div>
      </div>
    </div>
  );
};

// PYQAnalyzer
export const PYQAnalyzer: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">PYQ Analyzer</h1>
      <p className="text-gray-600">Analyze Previous Year Questions</p>
      <div className="mt-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <p>Upload PDF or paste PYQ content here</p>
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md">
          Upload PYQ
        </button>
      </div>
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
