import React from 'react';
import { BookOpen, Bot, HelpCircle, TestTube2, Trophy, Star, Zap, GraduationCap } from 'lucide-react';

// Interfaces for better type safety
export interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode; // Explicitly type as React.ReactNode
}

export interface QuickAction {
  title: string;
  href: string;
  icon: React.ReactNode; // Explicitly type as React.ReactNode
}

export interface RecentDoubt {
  id: number;
  title: string;
  subtitle: string;
  value: string;
}

export interface UpcomingTest {
  id: number;
  title: string;
  date: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: React.ReactNode; // Explicitly type as React.ReactNode
}


// Dashboard Mock Data
export const dashboardMockData = {
  stats: [
    { title: "Completed Chapters", value: "12", icon: <BookOpen className="h-4 w-4 text-muted-foreground" /> },
    { title: "Doubts Resolved", value: "23", icon: <HelpCircle className="h-4 w-4 text-muted-foreground" /> },
    { title: "Tests Taken", value: "8", icon: <TestTube2 className="h-4 w-4 text-muted-foreground" /> },
    { title: "AI Interactions", value: "142", icon: <Bot className="h-4 w-4 text-muted-foreground" /> },
  ] as Stat[], // Type assertion
  quickActions: [
    { title: "Study Material", href: "/study", icon: <BookOpen className="h-8 w-8 text-primary" /> },
    { title: "Ask a Doubt", href: "/doubts/create", icon: <HelpCircle className="h-8 w-8 text-primary" /> },
    { title: "Take a Test", href: "/tests", icon: <TestTube2 className="h-8 w-8 text-primary" /> },
    { title: "AI Studio", href: "/ai-studio", icon: <Bot className="h-8 w-8 text-primary" /> },
  ] as QuickAction[], // Type assertion
  recentDoubts: [
    { id: 1, title: "How to solve quadratic equations?", subtitle: "Mathematics", value: "Resolved" },
    { id: 2, title: "What is photosynthesis??", subtitle: "Biology", value: "Answered" },
    { id: 3, title: "Newton's Laws of Motion", subtitle: "Physics", value: "Answered" },
  ] as RecentDoubt[], // Type assertion
  upcomingTests: [
    { id: 1, title: "Calculus Chapter 5 Test", date: "2025-09-10" },
    { id: 2, title: "Organic Chemistry Mid-term", date: "2025-09-15" },
  ] as UpcomingTest[], // Type assertion
};

// Notification Mock Data
export const notificationMockData = [
  {
    id: 1,
    message: "New study material available for Physics: Electromagnetism!",
    type: "info",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    message: "Your doubt 'Quadratic Equations' has been answered.",
    type: "success",
    timestamp: "Yesterday",
  },
  {
    id: 3,
    message: "Upcoming test: Organic Chemistry Mid-term on Sep 15.",
    type: "warning",
    timestamp: "3 days ago",
  },
  {
    id: 4,
    message: "Failed to sync your progress. Please check your internet connection.",
    type: "error",
    timestamp: "1 week ago",
  },
] as Notification[]; // Type assertion

// Achievements Mock Data
export const achievementsMockData = [
  {
    id: '1',
    name: 'First Step',
    description: 'Completed your first chapter.',
    earned: true,
    icon: <BookOpen /> as React.ReactNode, // Type assertion for icon
  },
  {
    id: '2',
    name: 'Doubt Solver',
    description: 'Had 10 doubts resolved by AI.',
    earned: true,
    icon: <Zap /> as React.ReactNode, // Type assertion for icon
  },
  {
    id: '3',
    name: 'Test Master',
    description: 'Scored 90%+ on 5 tests.',
    earned: false,
    icon: <Trophy /> as React.ReactNode, // Type assertion for icon
  },
  {
    id: '4',
    name: 'Daily Learner',
    description: 'Used the app for 7 consecutive days.',
    earned: false,
    icon: <Star /> as React.ReactNode, // Type assertion for icon
  },
  {
    id: '5',
    name: 'Concept Explainer',
    description: 'Used AI to explain 20 concepts.',
    earned: true,
    icon: <GraduationCap /> as React.ReactNode, // Type assertion for icon
  },
  {
    id: '6',
    name: 'Summary Seeker',
    description: 'Generated 15 summaries.',
    earned: false,
    icon: <BookOpen /> as React.ReactNode, // Type assertion for icon
  },
] as Achievement[]; // Type assertion