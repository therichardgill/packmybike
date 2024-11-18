import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Mail, User as UserIcon, Bell } from 'lucide-react';
import type { User } from '../types';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const phoneRegex = /^\+[1-9]\d{1,14}$/;

const userEditSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(phoneRegex, 'Invalid mobile number format').optional(),
  role: z.enum(['user', 'admin']),
  status: z.enum(['active', 'suspended', 'pending']),
  verifiedEmail: z.boolean(),
  verifiedMobile: z.boolean(),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
  }),
});

type UserEditInputs = z.infer<typeof userEditSchema>;

interface UserEditModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (userId: string, data: Partial<User>) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({ user, onClose, onSave }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<UserEditInputs>({
    resolver: zodResolver(userEditSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      status: user.status,
      verifiedEmail: user.verifiedEmail,
      verifiedMobile: user.verifiedMobile || false,
      notificationPreferences: user.notificationPreferences || {
        email: true,
        sms: false,
      },
    } : undefined,
  });

  const watchMobile = watch('mobile');

  if (!user) return null;

  const onSubmit = (data: UserEditInputs) => {
    onSave(user.id, data);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-gray-800 rounded-xl p-8 shadow-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">Edit User</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('name')}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="User's name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('email')}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="user@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Mobile Number
                </label>
                <Controller
                  name="mobile"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <PhoneInput
                      country={'us'}
                      value={value}
                      onChange={phone => onChange(`+${phone}`)}
                      inputClass="!w-full !bg-gray-700 !text-white !rounded-lg !pl-12 !pr-4 !py-2 !border-gray-600 focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent"
                      buttonClass="!bg-gray-700 !border-gray-600 !rounded-l-lg hover:!bg-gray-600"
                      dropdownClass="!bg-gray-700 !text-white"
                      searchClass="!bg-gray-600 !text-white"
                      containerClass="!bg-gray-700 !rounded-lg"
                      searchPlaceholder="Search country..."
                    />
                  )}
                />
                {errors.mobile && (
                  <p className="text-red-400 text-sm mt-1">{errors.mobile.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Role
                </label>
                <select
                  {...register('role')}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
                {errors.status && (
                  <p className="text-red-400 text-sm mt-1">{errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register('verifiedEmail')}
                    className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-300">
                    Email verified
                  </label>
                </div>

                {watchMobile && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('verifiedMobile')}
                      className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-300">
                      Mobile verified
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Bell className="w-4 h-4 inline mr-2" />
                  Notification Preferences
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('notificationPreferences.email')}
                      className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-300">
                      Email notifications
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('notificationPreferences.sms')}
                      disabled={!watchMobile}
                      className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 disabled:opacity-50"
                    />
                    <label className="text-sm font-medium text-gray-300">
                      SMS notifications
                      {!watchMobile && (
                        <span className="text-xs text-gray-400 ml-2">
                          (Requires mobile number)
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEditModal;