import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4 text-center">Welcome to Concept Master</h1>
        <p className="text-center text-gray-600 mb-6">Learn Smart. Crack Easy. AI-powered education for Classes 1 to 12.</p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link to="/login" className="bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 transition">
            Get Started
          </Link>
          <Link to="/study" className="bg-purple-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-purple-700 transition">
            Explore Study Material
          </Link>
        </div>
      </div>

      <footer className="mt-8 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Concept Master
      </footer>
    </div>
  );
};

export default LandingPage;

