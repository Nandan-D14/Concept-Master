import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Link } from 'react-router-dom';

interface RecentActivityProps {
  title: string;
  items: any[];
  viewAllLink: string;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ title, items, viewAllLink }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Link to={viewAllLink} className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
              <div className="ml-auto font-medium">{item.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
