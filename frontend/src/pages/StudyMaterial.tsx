import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import StudyMaterialCard from '../components/StudyMaterialCard';

const mockStudyMaterials: {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'notes';
  subject: string;
  progress: number;
}[] = [
  { id: '1', title: 'Introduction to Calculus', description: 'Learn the basics of calculus, including limits, derivatives, and integrals.', type: 'notes', subject: 'Mathematics', progress: 75 },
  { id: '2', title: 'The Cell Cycle', description: 'An in-depth look at the cell cycle, including mitosis and meiosis.', type: 'video', subject: 'Biology', progress: 50 },
  { id: '3', title: 'Newtonian Physics', description: 'Explore the fundamental laws of motion and gravity.', type: 'notes', subject: 'Physics', progress: 90 },
  { id: '4', title: 'Organic Chemistry Basics', description: 'An introduction to the world of organic chemistry.', type: 'video', subject: 'Chemistry', progress: 25 },
  { id: '5', title: 'Data Structures and Algorithms', description: 'Learn about fundamental data structures and algorithms.', type: 'notes', subject: 'Computer Science', progress: 60 },
  { id: '6', title: 'World War II', description: 'A comprehensive overview of the causes, events, and consequences of World War II.', type: 'notes', subject: 'History', progress: 100 },
];

const StudyMaterial: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const filteredMaterials = mockStudyMaterials.filter((material) => {
    return (
      (selectedSubject === 'all' || material.subject === selectedSubject) &&
      (selectedType === 'all' || material.type === selectedType) &&
      material.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Study Material</h1>
        <p className="text-muted-foreground">Browse and search for study materials.</p>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search for materials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="Mathematics">Mathematics</SelectItem>
            <SelectItem value="Biology">Biology</SelectItem>
            <SelectItem value="Physics">Physics</SelectItem>
            <SelectItem value="Chemistry">Chemistry</SelectItem>
            <SelectItem value="Computer Science">Computer Science</SelectItem>
            <SelectItem value="History">History</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="notes">Notes</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <StudyMaterialCard key={material.id} {...material} />
        ))}
      </div>
    </div>
  );
};

export default StudyMaterial;
