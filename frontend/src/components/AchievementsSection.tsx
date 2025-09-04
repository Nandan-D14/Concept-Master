import React from 'react';
import BadgeCard from './BadgeCard';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

import { achievementsMockData, Achievement } from '../data/dummyData';



const AchievementsSection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievementsMockData.map((achievement: Achievement) => ( // Explicitly type achievement
            <BadgeCard
              key={achievement.id}
              name={achievement.name}
              description={achievement.description}
              earned={achievement.earned}
              icon={achievement.icon}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AchievementsSection;
