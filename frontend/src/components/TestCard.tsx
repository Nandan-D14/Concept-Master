import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Clock, HelpCircle, ListChecks } from 'lucide-react';

interface TestCardProps {
  id: string;
  title: string;
  subject: string;
  questions: number;
  timeLimit: number; // in minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const TestCard: React.FC<TestCardProps> = ({ id, title, subject, questions, timeLimit, difficulty }) => {
    const difficultyClasses = {
        Easy: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Hard: 'bg-red-100 text-red-800',
    };

  return (
    <Card>
        <CardHeader>
            <div className="flex justify-between">
                <CardTitle className="text-lg">{title}</CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${difficultyClasses[difficulty]}`}>
                    {difficulty}
                </span>
            </div>
        </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
            <ListChecks className="h-4 w-4 mr-2" />
            <span>{questions} Questions</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{timeLimit} Minutes</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <HelpCircle className="h-4 w-4 mr-2" />
            <span>{subject}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link to={`/tests/${id}`} className="w-full">
            <Button className="w-full">Start Test</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TestCard;
