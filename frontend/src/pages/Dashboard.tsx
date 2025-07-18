import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  BookOpenIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  SparklesIcon,
  TrophyIcon,
  CalendarDaysIcon,
  FireIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { usersAPI } from '../services/api';
import { useAuth } from '../store';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch dashboard data
  const { data: dashboardData, isLoading, error } = useQuery(
    'dashboard',
    usersAPI.getDashboard,
    {
      refetchOnWindowFocus: false,
    }
  );

  const dashboard = dashboardData?.data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p>Error loading dashboard. Please try again.</p>
      </div>
    );
  }

  const quickActions = [
    {
      name: 'Study Material',
      description: 'Access notes, videos, and practice questions',
      href: '/study',
      icon: BookOpenIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Ask Doubt',
      description: 'Get instant AI-powered answers',
      href: '/doubts/create',
      icon: QuestionMarkCircleIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Take Test',
      description: 'Practice with mock tests and quizzes',
      href: '/tests',
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'AI Tools',
      description: 'Simplify text, explain concepts, generate questions',
      href: '/ai-tools',
      icon: SparklesIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Level {dashboard?.progress?.currentLevel || 1}</span>
                <span className="ml-1 text-yellow-500">★</span>
              </div>
              <div className="text-sm text-gray-600">
                {dashboard?.progress?.totalXP || 0} XP
              </div>
            </div>
            <div className="text-sm text-blue-600 mt-1">
              {dashboard?.user?.subscription?.type === 'demo' ? 
                `${dashboard?.user?.remainingDays || 0} days free trial left` :
                `${dashboard?.user?.subscription?.type} subscription`
              }
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpenIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Chapters</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard?.progress?.completedChapters || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <QuestionMarkCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Doubts Asked</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard?.stats?.totalDoubtsAsked || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <AcademicCapIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tests Taken</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard?.stats?.totalTestsAttempted || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <FireIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Study Streak</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dashboard?.stats?.studyStreak || 0} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${action.color} rounded-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{action.name}</h3>
                  <p className="text-sm text-gray-500">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Doubts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Doubts</h2>
            <Link
              to="/doubts"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {dashboard?.recent?.doubts?.length > 0 ? (
              dashboard?.recent?.doubts?.map((doubt: any) => (
                <div key={doubt._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{doubt.title}</h3>
                    <p className="text-sm text-gray-500">
                      {doubt.status} • {new Date(doubt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded ${
                    doubt.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    doubt.status === 'answered' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {doubt.status}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent doubts</p>
            )}
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tests</h2>
            <Link
              to="/tests"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {dashboard?.recent?.tests?.length > 0 ? (
              dashboard?.recent?.tests?.map((test: any) => (
                <div key={test._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 truncate">{test.test?.title}</h3>
                    <p className="text-sm text-gray-500">
                      {test.test?.subject} • {new Date(test.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {test.score?.percentage?.toFixed(1)}%
                    </div>
                    <div className={`text-xs ${
                      test.result === 'Pass' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {test.result}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent tests</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Tests */}
      {dashboard?.recent?.upcomingTests?.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CalendarDaysIcon className="h-5 w-5 mr-2" />
            Upcoming Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard?.recent?.upcomingTests?.map((test: any) => (
              <div key={test._id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">{test.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{test.subject}</p>
                <p className="text-sm text-blue-600">
                  {new Date(test.schedule.startDate).toLocaleDateString()}
                </p>
                <Link
                  to={`/tests/${test._id}`}
                  className="mt-2 inline-block text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Performance Overview
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Average Score</span>
                <span>{dashboard?.stats?.averageScore?.toFixed(1) || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${dashboard?.stats?.averageScore || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Study Progress</span>
                <span>{((dashboard?.progress?.completedChapters || 0) / 100 * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(dashboard?.progress?.completedChapters || 0) / 100 * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Badges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrophyIcon className="h-5 w-5 mr-2" />
            Recent Achievements
          </h2>
          <div className="space-y-3">
            {dashboard?.progress?.badges?.length > 0 ? (
              dashboard?.progress?.badges?.map((badge: any, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-600 text-xl">🏆</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{badge.name}</h3>
                    <p className="text-sm text-gray-500">{badge.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No badges earned yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
