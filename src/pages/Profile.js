import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from '../components/UserProfile';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please sign in to view your profile
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You need to be authenticated to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2">
            <UserProfile />
          </div>

          {/* Additional Info Section */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Account Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    User ID
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                    {user.id}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Sign In
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.last_sign_in_at ? 
                      new Date(user.last_sign_in_at).toLocaleString() : 
                      'Never'
                    }
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Confirmed
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.email_confirmed_at ? 'Yes' : 'No'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Confirmed
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {user.phone_confirmed_at ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Tips */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-4">
                Security Tips
              </h3>
              <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <li>• Keep your contact information up to date</li>
                <li>• Use a strong, unique password if you set one</li>
                <li>• Enable two-factor authentication if available</li>
                <li>• Never share your OTP codes with anyone</li>
                <li>• Sign out when using shared devices</li>
              </ul>
            </div>

            {/* Blood Bank Info */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-4">
                Blood Bank Features
              </h3>
              <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                <li>• Search for blood donors</li>
                <li>• Register as a blood donor</li>
                <li>• View donor information</li>
                <li>• Manage your donor profile</li>
                <li>• Track donation history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 