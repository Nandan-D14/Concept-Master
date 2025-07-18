import React from 'react';

const PYQAnalyzer: React.FC = () => {
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

export default PYQAnalyzer;
