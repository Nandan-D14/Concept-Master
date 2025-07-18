import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, BookOpenIcon, PlayIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { contentAPI } from '../services/api';
import { useAuth } from '../store';

const StudyMaterial: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const { data: subjectsData } = useQuery(
    ['subjects', user?.class],
    () => contentAPI.getSubjects(user?.class || 10),
    { enabled: !!user?.class }
  );

  const { data: contentData, isLoading } = useQuery(
    ['content', selectedSubject, selectedType, searchTerm],
    () => contentAPI.getContent({
      subject: selectedSubject,
      type: selectedType,
      search: searchTerm,
      page: 1,
      limit: 20
    }),
    { refetchOnWindowFocus: false }
  );

  const subjects = subjectsData?.data?.data || [];
  const content = contentData?.data?.data?.content || [];

  const contentTypes = [
    { value: '', label: 'All Types' },
    { value: 'notes', label: 'Notes' },
    { value: 'video', label: 'Videos' },
    { value: 'practice', label: 'Practice' },
    { value: 'formula', label: 'Formulas' },
    { value: 'summary', label: 'Summary' }
  ];

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <PlayIcon className="h-5 w-5" />;
      case 'practice':
        return <DocumentTextIcon className="h-5 w-5" />;
      default:
        return <BookOpenIcon className="h-5 w-5" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Study Material</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((subject: string) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {contentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : content.length > 0 ? (
          content.map((item: any) => (
            <Link
              key={item._id}
              to={`/study/${item._id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center text-blue-600">
                  {getContentIcon(item.type)}
                  <span className="ml-2 text-sm font-medium capitalize">{item.type}</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                  {item.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{item.subject}</span>
                <span>{item.chapter}</span>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>👀 {item.views}</span>
                  <span>📚 {item.bookmarks}</span>
                </div>
                <span className="text-blue-600 font-medium">View →</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No content found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterial;
