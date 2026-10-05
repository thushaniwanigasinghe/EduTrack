import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-700/60 px-4 sm:px-6 flex items-center justify-between">
      {/* Left section: Hamburger for Mobile */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-colors"
          aria-label="Open Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="hidden sm:inline-block text-sm font-semibold text-gray-500 dark:text-gray-400">
          Admin Control Center
        </span>
      </div>

      {/* Right section: Dark mode toggle & User Profile */}
      <div className="flex items-center space-x-4">
        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User badge */}
        <div className="flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/60 text-purple-900 dark:text-primary-300 rounded-full flex items-center justify-center font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
                {user?.name || 'Administrator'}
              </span>
              <span className="text-xs text-gray-400 leading-tight">
                {user?.email || 'admin@school.edu'}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => logout(true)}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-lg transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
