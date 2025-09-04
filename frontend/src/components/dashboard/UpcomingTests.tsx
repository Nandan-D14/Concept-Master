import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Link } from 'react-router-dom';

interface UpcomingTestsProps {
  tests: any[];
}

const UpcomingTests: React.FC<UpcomingTestsProps> = ({ tests }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Tests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{test.title}</p>
                <p className="text-sm text-muted-foreground">{test.date}</p>
              </div>
              <Link to={`/tests/${test.id}`} className="ml-auto font-medium text-primary hover:underline">
                View
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingTests;
