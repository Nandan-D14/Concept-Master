import React from 'react';

const CreateDoubt: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Ask a Doubt</h1>
      <p className="text-gray-600 mb-6">Get instant AI-powered answers to your questions</p>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Enter your doubt title..." />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea className="w-full p-2 border border-gray-300 rounded-md" rows={4} placeholder="Describe your doubt in detail..."></textarea>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select className="w-full p-2 border border-gray-300 rounded-md">
              <option>Select Subject</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Biology</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
            <input type="text" className="w-full p-2 border border-gray-300 rounded-md" placeholder="Chapter name..." />
          </div>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
          Submit Doubt
        </button>
      </form>
    </div>
  );
};

export default CreateDoubt;
