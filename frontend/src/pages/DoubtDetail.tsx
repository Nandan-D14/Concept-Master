import React from 'react';
import { useParams } from 'react-router-dom';

const DoubtDetail: React.FC = () => {
  const { id } = useParams();
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Doubt Detail</h1>
      <p>Viewing doubt with ID: {id}</p>
    </div>
  );
};

export default DoubtDetail;
