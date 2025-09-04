import React, { useState } from 'react'; // Import useState
import { Search, Bell, User, ChevronsLeft } from 'lucide-react';
import { useTheme } from '../lib/theme-provider';
import NotificationCenter from './NotificationCenter'; // Import NotificationCenter

const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false); // New state for notifications

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
       <button type="button" className="-m-2.5 p-2.5 text-muted-foreground lg:hidden">
        <ChevronsLeft className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-muted-foreground/20 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-muted-foreground" aria-hidden="true" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-foreground placeholder:text-muted-foreground focus:ring-0 sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
          >
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Notification Bell and Dropdown */}
          <div className="relative">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => setShowNotifications(!showNotifications)} // Toggle notifications
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <NotificationCenter />
              </div>
            )}
          </div>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-muted-foreground/20" aria-hidden="true" />

          <div className="relative">
             <button className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="hidden lg:flex lg:items-center">
                    <span className="ml-4 text-sm font-semibold leading-6 text-foreground" aria-hidden="true">
                        Nanda
                    </span>
                </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
