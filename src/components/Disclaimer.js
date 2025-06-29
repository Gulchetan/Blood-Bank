import React from 'react';

const Disclaimer = ({ variant = 'banner' }) => {
  if (variant === 'banner') {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6 text-center">
        <div className="flex justify-center items-center">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          <div className="ml-3 flex justify-center items-center">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center flex">
              <strong> Project Notice:</strong> This is a  project for educational purposes only. 
              This is NOT a real blood bank website and should not be used for actual blood donation services.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Disclaimer:</strong> This is a project for educational purposes only. 
              This application is NOT affiliated with any real blood bank or medical institution. 
              Do not use this for actual blood donation services.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Disclaimer; 