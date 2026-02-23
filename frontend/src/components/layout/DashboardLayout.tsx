import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

/**
 * DashboardLayout props
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout component
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /**
   * Toggle sidebar (mobile)
   */
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  /**
   * Close sidebar
   */
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar onMenuClick={toggleSidebar} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;