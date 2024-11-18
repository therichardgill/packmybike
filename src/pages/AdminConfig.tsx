import React from 'react';
import { Cog, AlertTriangle } from 'lucide-react';
import Collapsible from '../components/Collapsible';
import ConfigurationManager from '../components/ConfigurationManager';
import { clearAllUsers } from '../utils/clearFirebaseUsers';

const AdminConfig: React.FC = () => {
  const handleClearUsers = async () => {
    if (window.confirm('Are you sure you want to clear all users? This action cannot be undone.')) {
      try {
        await clearAllUsers();
        alert('All users have been cleared successfully');
      } catch (error) {
        console.error('Failed to clear users:', error);
        alert('Failed to clear users. Please check the console for details.');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Collapsible
        title={
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
            <p className="text-gray-600">Manage system settings and integrations</p>
          </div>
        }
        icon={<Cog className="w-8 h-8 text-primary-500" />}
      >
        <ConfigurationManager />
      </Collapsible>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Danger Zone</h3>
            <p className="text-gray-600">Irreversible system operations</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-700">Clear All Users</h4>
              <p className="text-sm text-red-600">
                This will permanently delete all user accounts and their data
              </p>
            </div>
            <button
              onClick={handleClearUsers}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-200"
            >
              Clear Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminConfig;