import React from 'react';
import { useParams } from 'react-router-dom';

const ContentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Content Viewer</h1>
      <p className="text-gray-600">Viewing content with ID: {id}</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>This page will display the full content including:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Study notes and materials</li>
          <li>Video content</li>
          <li>Practice questions</li>
          <li>AI-powered explanations</li>
        </ul>
      </div>
    </div>
  );
};

export default ContentViewer;
