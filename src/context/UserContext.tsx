import React, { createContext, useContext, useState } from 'react';
import type { User } from '../types';

interface UserContextType {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Omit<User, 'id'>) => void;
  deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      mobile: '+1234567890',
      role: 'admin',
      status: 'active',
      listings: [],
      createdAt: new Date('2024-01-15'),
      lastLogin: new Date('2024-03-10'),
      verifiedEmail: true,
      verifiedMobile: true,
      notificationPreferences: {
        email: true,
        sms: true,
      },
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      mobile: '+1987654321',
      role: 'user',
      status: 'active',
      listings: [],
      createdAt: new Date('2024-02-20'),
      lastLogin: new Date('2024-03-09'),
      verifiedEmail: true,
      verifiedMobile: false,
      notificationPreferences: {
        email: true,
        sms: false,
      },
    },
    {
      id: '3',
      email: 'bob@example.com',
      name: 'Bob Wilson',
      role: 'user',
      status: 'suspended',
      listings: [],
      createdAt: new Date('2024-03-01'),
      lastLogin: new Date('2024-03-05'),
      verifiedEmail: false,
      notificationPreferences: {
        email: true,
        sms: false,
      },
    },
  ]);

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, user: Omit<User, 'id'>) => {
    setUsers(users.map(u => u.id === id ? { ...user, id } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}