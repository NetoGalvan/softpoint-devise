import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaHome, FaPlus, FaTimes } from 'react-icons/fa';

/**
 * Sidebar props
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Navigation item interface
 */
interface NavItem {
  path: string;
  label: string;
  icon: React.ReactElement;
}

/**
 * Navigation items
 */
const navItems: NavItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: <FaTachometerAlt />,
  },
  {
    path: '/properties',
    label: 'Properties',
    icon: <FaHome />,
  },
  {
    path: '/properties/create',
    label: 'Add Property',
    icon: <FaPlus />,
  },
];

/**
 * Sidebar component
 */
export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;