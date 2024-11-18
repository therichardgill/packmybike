import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Home,
  Package,
  PlusCircle,
  Settings,
  Users,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Cog,
} from 'lucide-react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Close menu when route changes
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  const menuItems = [
    { path: '/', label: 'Home', icon: Home },
    ...(user
      ? [
          {
            path: '/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
          },
          {
            path: '/listings/new',
            label: 'New Listing',
            icon: PlusCircle,
          },
        ]
      : []),
    ...(user?.role === 'admin'
      ? [
          {
            path: '/admin/listings',
            label: 'Listings',
            icon: ShoppingBag,
          },
          {
            path: '/admin/bags',
            label: 'Bag Management',
            icon: Package,
          },
          {
            path: '/admin/users',
            label: 'User Management',
            icon: Users,
          },
          {
            path: '/admin/config',
            label: 'Configuration',
            icon: Cog,
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-500/20 text-blue-400'
                          : ''
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {user && (
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center space-x-3 w-full px-4 py-3 text-gray-300 hover:bg-gray-700/50 transition-colors rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;