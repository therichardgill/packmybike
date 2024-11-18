import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onViewChange }) => {
  return (
    <div className="flex items-center space-x-2 bg-gray-700/50 backdrop-blur rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded ${
          view === 'grid'
            ? 'bg-blue-500/20 text-blue-400'
            : 'text-gray-400 hover:bg-gray-600/50'
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded ${
          view === 'list'
            ? 'bg-blue-500/20 text-blue-400'
            : 'text-gray-400 hover:bg-gray-600/50'
        }`}
        aria-label="List view"
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ViewToggle;