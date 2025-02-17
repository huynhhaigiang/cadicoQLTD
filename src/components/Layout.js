// Layout.js
import React, { useState } from 'react';
import Navigation from './Navigation';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`${
          isNavCollapsed ? 'w-16' : 'w-64'
        } bg-white shadow-xl fixed h-screen transition-all duration-300 ease-out z-30`}
      >
        <Navigation onToggle={setIsNavCollapsed} />
      </aside>

      {/* Main content */}
      <div 
        className={`flex-1 transition-margin duration-300 ease-out ${
          isNavCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <main className="p-6 overflow-y-auto h-full">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;