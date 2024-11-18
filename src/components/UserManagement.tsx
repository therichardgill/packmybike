import React, { useState } from 'react';
import { useUsers } from '../context/UserContext';
import { useBrands } from '../context/BrandContext';
import { Mail, Calendar, Shield, AlertCircle, Check, X, Edit2, UserX, UserCheck, Plus } from 'lucide-react';
import type { User } from '../types';
import UserEditModal from './UserEditModal';
import NewListingModal from './NewListingModal';

const UserManagement: React.FC = () => {
  const { users, updateUser, deleteUser } = useUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showNewListingModal, setShowNewListingModal] = useState(false);
  const [selectedUserForListing, setSelectedUserForListing] = useState<User | null>(null);

  const handleStatusChange = (userId: string, status: User['status']) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, { ...user, status });
    }
  };

  const handleRoleChange = (userId: string, role: User['role']) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, { ...user, role });
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId);
    }
  };

  const handleSaveUser = (userId: string, data: Partial<User>) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      updateUser(userId, { ...user, ...data });
    }
  };

  const handleAddListing = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUserForListing(user);
      setShowNewListingModal(true);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'suspended':
        return 'text-red-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="pb-3 text-gray-400 font-medium">User</th>
              <th className="pb-3 text-gray-400 font-medium">Role</th>
              <th className="pb-3 text-gray-400 font-medium">Status</th>
              <th className="pb-3 text-gray-400 font-medium">Joined</th>
              <th className="pb-3 text-gray-400 font-medium">Listings</th>
              <th className="pb-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="group hover:bg-gray-700/30">
                <td className="py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-300">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.email}
                        {user.verifiedEmail && (
                          <Check className="w-4 h-4 ml-1 text-green-400" />
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                    className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="py-4">
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value as User['status'])}
                    className={`bg-gray-700 rounded px-2 py-1 text-sm ${getStatusColor(user.status)}`}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td className="py-4">
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      {user.listings.length} listings
                    </span>
                    <button
                      onClick={() => handleAddListing(user.id)}
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Add listing"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Edit user"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {user.status === 'active' ? (
                      <button
                        onClick={() => handleStatusChange(user.id, 'suspended')}
                        className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                        title="Suspend user"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(user.id, 'active')}
                        className="p-1 text-green-400 hover:text-green-300 transition-colors"
                        title="Activate user"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete user"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Users Found</h3>
          <p className="text-gray-400">There are no users in the system yet.</p>
        </div>
      )}

      <UserEditModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onSave={handleSaveUser}
      />

      <NewListingModal
        isOpen={showNewListingModal}
        onClose={() => {
          setShowNewListingModal(false);
          setSelectedUserForListing(null);
        }}
        user={selectedUserForListing}
      />
    </div>
  );
};

export default UserManagement;