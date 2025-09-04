import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, HelpCircle, TestTube2, Bot, BarChart, Trophy, User, Settings } from 'lucide-react'; // Removed PanelLeft

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Study Material', href: '/study', icon: Book },
  { name: 'Doubts', href: '/doubts', icon: HelpCircle },
  { name: 'Tests', href: '/tests', icon: TestTube2 },
  { name: 'AI Studio', href: '/ai-studio', icon: Bot },
  { name: 'PYQ Analyzer', href: '/pyq-analyzer', icon: BarChart },
  { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
];

const userNavigation = [
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-2xl font-bold text-primary">Concept Master</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-7"> {/* Removed role="list" */}
            <li>
              <ul className="-mx-2 space-y-1"> {/* Removed role="list" */}
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <ul className="-mx-2 space-y-1"> {/* Removed role="list" */}
                {userNavigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <li key={item.name}>
                        <Link
                            to={item.href}
                            className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                            {item.name}
                        </Link>
                        </li>
                    );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;