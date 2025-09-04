import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import TestCard from '../components/TestCard';

const mockTests: {
  id: string;
  title: string;
  subject: string;
  questions: number;
  timeLimit: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}[] = [
  { id: '1', title: 'Calculus Chapter 5 Test', subject: 'Mathematics', questions: 20, timeLimit: 60, difficulty: 'Medium' },
  { id: '2', title: 'Organic Chemistry Mid-term', subject: 'Chemistry', questions: 50, timeLimit: 90, difficulty: 'Hard' },
  { id: '3', title: 'Photosynthesis Quiz', subject: 'Biology', questions: 15, timeLimit: 20, difficulty: 'Easy' },
  { id: '4', title: 'JavaScript Fundamentals', subject: 'Computer Science', questions: 30, timeLimit: 45, difficulty: 'Medium' },
  { id: '5', title: 'Modern Physics Final', subject: 'Physics', questions: 40, timeLimit: 120, difficulty: 'Hard' },
  { id: '6', title: 'World History: 1900-1950', subject: 'History', questions: 25, timeLimit: 30, difficulty: 'Easy' },
];

const TestsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredTests = mockTests.filter((test) => {
    return (
      (selectedSubject === 'all' || test.subject === selectedSubject) &&
      (selectedDifficulty === 'all' || test.difficulty === selectedDifficulty) &&
      test.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
        <p className="text-muted-foreground">Assess your knowledge and prepare for exams.</p>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search for tests..."
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
        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Difficulties" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <TestCard key={test.id} {...test} />
        ))}
      </div>
    </div>
  );
};

export default TestsPage;
