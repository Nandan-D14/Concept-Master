import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import AIChatbot from './AIChatbot'; // Added import

interface NewLayoutProps {
  children: React.ReactNode;
}

const NewLayout: React.FC<NewLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <Sidebar />
      <div className="lg:pl-72">
        <Header />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
      <AIChatbot /> {/* Added AIChatbot */}
    </div>
  );
};

export default NewLayout;