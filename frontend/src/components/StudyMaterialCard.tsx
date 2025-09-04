import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { BookOpen, PlayCircle } from 'lucide-react';

interface StudyMaterialCardProps {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'notes';
  subject: string;
  progress: number;
}

const StudyMaterialCard: React.FC<StudyMaterialCardProps> = ({ id, title, description, type, subject, progress }) => {
  return (
    <Link to={`/study/${id}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{title}</CardTitle>
            {type === 'video' ? <PlayCircle className="h-6 w-6 text-primary" /> : <BookOpen className="h-6 w-6 text-primary" />}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
            <div className="w-full mb-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{subject}</span>
                    <span>{progress}% Complete</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default StudyMaterialCard;
