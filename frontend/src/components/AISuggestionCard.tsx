import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

interface AISuggestionCardProps {
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
}

const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  title,
  description,
  actionText,
  actionLink,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-end">
        <Button asChild>
          <a href={actionLink} className="flex items-center">
            {actionText} <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AISuggestionCard;
