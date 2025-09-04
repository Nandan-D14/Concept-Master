import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Button } from '../components/ui/button'; // Corrected import
import DoubtCard from '../components/DoubtCard';
import { Link } from 'react-router-dom';

const mockDoubts: {
  id: string;
  title: string;
  subject: string;
  tags: string[];
  upvotes: number;
  answers: number;
  status: 'resolved' | 'answered' | 'unanswered';
}[] = [
  { id: '1', title: 'How to solve quadratic equations?', subject: 'Mathematics', tags: ['algebra', 'equations'], upvotes: 12, answers: 3, status: 'resolved' },
  { id: '2', title: 'What is photosynthesis?', subject: 'Biology', tags: ['plants', 'cellular respiration'], upvotes: 8, answers: 2, status: 'answered' },
  { id: '3', title: "Newton's Laws of Motion", subject: 'Physics', tags: ['mechanics', 'gravity'], upvotes: 25, answers: 5, status: 'resolved' }, // Corrected line
  { id: '4', title: 'Understanding React Hooks', subject: 'Computer Science', tags: ['react', 'javascript'], upvotes: 42, answers: 12, status: 'resolved' },
  { id: '5', title: 'The Krebs Cycle', subject: 'Chemistry', tags: ['biochemistry', 'cellular respiration'], upvotes: 5, answers: 1, status: 'answered' },
  { id: '6', title: 'Causes of World War I', subject: 'History', tags: ['history', 'war'], upvotes: 15, answers: 4, status: 'unanswered' },
];

const DoubtsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredDoubts = mockDoubts.filter((doubt) => {
    return (
      (selectedSubject === 'all' || doubt.subject === selectedSubject) &&
      (selectedStatus === 'all' || doubt.status === selectedStatus) &&
      doubt.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doubts</h1>
          <p className="text-muted-foreground">Ask questions and get answers from the community.</p>
        </div>
        <Link to="/doubts/create">
            <Button>Ask a Doubt</Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Search for doubts..."
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
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="answered">Answered</SelectItem>
            <SelectItem value="unanswered">Unanswered</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredDoubts.map((doubt) => (
          <DoubtCard key={doubt.id} {...doubt} />
        ))}
      </div>
    </div>
  );
};

export default DoubtsPage;
