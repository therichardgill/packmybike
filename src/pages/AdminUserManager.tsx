import React from 'react';
import { Users } from 'lucide-react';
import UserManagement from '../components/UserManagement';
import Collapsible from '../components/Collapsible';

function AdminUserManager() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Collapsible
        title={
          <div>
            <h2 className="text-2xl font-bold text-white">User Management</h2>
            <p className="text-gray-400">Manage user accounts and permissions</p>
          </div>
        }
        icon={<Users className="w-8 h-8 text-green-500" />}
      >
        <UserManagement />
      </Collapsible>
    </div>
  );
}

export default AdminUserManager;