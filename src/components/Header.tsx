import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import UserMenu from './UserMenu';
import LocationSelector from './LocationSelector';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="w-8 h-8 text-primary-300" />
            <span className="text-xl font-bold text-gray-900">packmybike</span>
          </Link>

          <div className="flex items-center space-x-6">
            <LocationSelector />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;