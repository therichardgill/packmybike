import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Plus, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link
          to="/sign-in"
          className="text-gray-700 hover:text-gray-900 font-medium"
        >
          Sign in
        </Link>
        <Link
          to="/sign-up"
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Sign up
        </Link>
      </div>
    );
  }

  const initials = [
    user.firstName?.[0] || '',
    user.lastName?.[0] || ''
  ].filter(Boolean).join('') || '?';

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
        <span>{user.firstName || 'User'}</span>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-sm font-medium">{initials}</span>
        </div>
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
        <Link
          to="/profile"
          className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Profile Settings</span>
          </div>
        </Link>
        <Link
          to="/dashboard"
          className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Dashboard</span>
          </div>
        </Link>
        <Link
          to="/listings/new"
          className="block px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Listing</span>
          </div>
        </Link>
        <button
          onClick={async () => {
            await signOut();
            navigate('/');
          }}
          className="w-full text-left px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 flex items-center space-x-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;