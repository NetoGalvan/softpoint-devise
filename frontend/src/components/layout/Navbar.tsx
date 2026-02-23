import React, { useState } from 'react';
import { FaHome, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useAuth, useToast } from '@/hooks';

/**
 * Navbar props
 */
interface NavbarProps {
  onMenuClick: () => void;
}

/**
 * Navbar component
 */
export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [showUserMenu, setShowUserMenu] = useState(false);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <FaBars className="text-xl" />
          </button>

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <FaHome className="text-2xl text-blue-600" />
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Softpoint / Devise
            </span>
          </div>
        </div>

        {/* Right side */}
        <div className="relative">
          {/* User button */}
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
              <FaUser className="text-blue-600" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <FaSignOutAlt className="text-gray-400" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;