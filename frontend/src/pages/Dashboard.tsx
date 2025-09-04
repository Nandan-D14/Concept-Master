import React from 'react';

import StatCard from '../components/dashboard/StatCard';
import QuickAction from '../components/dashboard/QuickAction';
import RecentActivity from '../components/dashboard/RecentActivity';
import UpcomingTests from '../components/dashboard/UpcomingTests';
import AISuggestionCard from '../components/AISuggestionCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'; // Import Card components
import { dashboardMockData, Stat, QuickAction as IQuickAction } from '../data/dummyData'; // Import Stat and QuickAction interfaces



const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, Nanda! 👋</h1>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* AI Suggestion Card - Spans full width on small screens, 4 columns on large */}
        <div className="lg:col-span-4">
          <AISuggestionCard
            title="AI Suggestion: Review Weak Areas"
            description="Based on your recent test performance, we recommend reviewing 'Thermodynamics' and 'Organic Chemistry basics'."
            actionText="Start Review"
            actionLink="/study/thermodynamics"
          />
        </div>

        {/* Performance Overview / Chart Placeholder - Spans 8 columns on large screens */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for a chart */}
              <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-md">
                [Chart Placeholder: e.g., Progress over time, Subject-wise scores]
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards - Spans full width on small screens, 4 columns each on large */}
        <div className="lg:col-span-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardMockData.stats.map((stat: Stat) => ( // Explicitly type stat
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Quick Actions - Spans full width on small screens, 4 columns each on large */}
        <div className="lg:col-span-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardMockData.quickActions.map((action: IQuickAction) => ( // Use IQuickAction here
            <QuickAction key={action.title} {...action} />
          ))}
        </div>

        {/* Recent Activity & Upcoming Tests - Spans full width on small screens, 7 columns on large */}
        <div className="lg:col-span-12 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <RecentActivity title="Recent Doubts" items={dashboardMockData.recentDoubts} viewAllLink="/doubts" />
          </div>
          <div className="lg:col-span-3">
            <UpcomingTests tests={dashboardMockData.upcomingTests} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
