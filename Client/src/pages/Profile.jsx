import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { User, Mail, PenSquare, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-900 text-white p-4">
        <p className="text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center p-8"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <User size={80} className="text-emerald-500 dark:text-emerald-400 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h1>
          <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
            <Mail size={18} />
            <span>{user.email}</span>
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Your Activity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-emerald-50 dark:bg-emerald-950 p-6 rounded-lg shadow-md flex items-center space-x-4"
            >
              <PenSquare size={24} className="text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Articles Written</h3>
                <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">5</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg shadow-md flex items-center space-x-4"
            >
              <LogOut size={24} className="text-blue-600 dark:text-blue-400" />
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">Comments Made</h3>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">12</p>
              </div>
            </motion.div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <Link
              to="/articles/create"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all"
            >
              <PenSquare size={20} className="mr-2" />
              Write New Article
            </Link>
            <button
              onClick={logout}
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-all"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
