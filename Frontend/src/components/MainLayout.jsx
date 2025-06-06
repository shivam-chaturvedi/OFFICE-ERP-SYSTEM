import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = ({ user, children }) => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Right side: Navbar + Content */}
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar user={user} />

        {/* Main content area */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
