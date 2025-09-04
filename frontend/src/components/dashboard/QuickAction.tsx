import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';

interface QuickActionProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const QuickAction: React.FC<QuickActionProps> = ({ title, href, icon }) => {
  return (
    <Link to={href}>
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center p-6">
          {icon}
          <p className="mt-2 text-sm font-semibold">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default QuickAction;
