import React from 'react';

const AITools: React.FC = () => {
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

export default AITools;
