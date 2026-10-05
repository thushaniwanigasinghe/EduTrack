import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div>
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">404</h1>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mt-2">
            Page Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm shadow-md transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
