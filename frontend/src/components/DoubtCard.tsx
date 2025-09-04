import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { MessageSquare, ThumbsUp } from 'lucide-react';

interface DoubtCardProps {
  id: string;
  title: string;
  subject: string;
  tags: string[];
  upvotes: number;
  answers: number;
  status: 'resolved' | 'answered' | 'unanswered';
}

const DoubtCard: React.FC<DoubtCardProps> = ({ id, title, subject, tags, upvotes, answers, status }) => {
  const statusClasses = {
    resolved: 'bg-green-100 text-green-800',
    answered: 'bg-blue-100 text-blue-800',
    unanswered: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
            <div className="flex justify-between">
                <CardTitle className="text-lg">
                    <Link to={`/doubts/${id}`} className="hover:underline">
                        {title}
                    </Link>
                </CardTitle>
                <span className={`px-2 py-1 text-xs rounded-full ${statusClasses[status]}`}>
                    {status}
                </span>
            </div>
        </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          {tags.map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                {upvotes}
            </div>
            <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                {answers}
            </div>
        </div>
        <div className="text-sm text-muted-foreground">{subject}</div>
      </CardFooter>
    </Card>
  );
};

export default DoubtCard;
