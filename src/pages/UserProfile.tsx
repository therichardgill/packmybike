import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import AddressAutocomplete from '../components/AddressAutocomplete';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().optional(),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    unit: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(3, 'Postal code is required'),
    country: z.string().min(2, 'Country is required'),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    privacy: z.enum(['public', 'city_only']),
  }).optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    sms: z.boolean(),
  }),
});

type ProfileInputs = z.infer<typeof profileSchema>;

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      address: user?.address,
      notificationPreferences: user?.notificationPreferences || {
        email: true,
        sms: false,
      },
    },
  });

  const onSubmit = async (data: ProfileInputs) => {
    try {
      setIsSaving(true);
      await updateUser(data);
      // Show success message or redirect
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Profile Settings</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Information */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  {...register('firstName')}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {errors.firstName && (
                  <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  {...register('lastName')}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
              {user.verifiedEmail && (
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified email
                </p>
              )}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Mobile Number
              </label>
              <Controller
                name="mobile"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <PhoneInput
                    country="au"
                    value={value}
                    onChange={phone => onChange(`+${phone}`)}
                    inputClass="!w-full !bg-gray-700 !text-white !rounded-lg !pl-12 !pr-4 !py-2 !border-gray-600 focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent"
                    buttonClass="!bg-gray-700 !border-gray-600 !rounded-l-lg hover:!bg-gray-600"
                    dropdownClass="!bg-gray-700 !text-white"
                    searchClass="!bg-gray-600 !text-white"
                    containerClass="!bg-gray-700 !rounded-lg"
                    searchPlaceholder="Search country..."
                    enableSearch
                    disableSearchIcon
                    countryCodeEditable={false}
                    preferredCountries={['au', 'nz', 'gb', 'us', 'ca', 'ie']}
                  />
                )}
              />
              {errors.mobile && (
                <p className="text-red-400 text-sm mt-1">{errors.mobile.message}</p>
              )}
              {user.verifiedMobile && (
                <p className="text-green-400 text-sm mt-1 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Verified number
                </p>
              )}
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Address</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Street Address
                </label>
                <AddressAutocomplete
                  setValue={setValue}
                  defaultValue={user.address?.street}
                />
                {errors.address?.street && (
                  <p className="text-red-400 text-sm mt-1">{errors.address.street.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Apartment/Unit (Optional)
                </label>
                <input
                  {...register('address.unit')}
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Apt, Suite, Unit, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    {...register('address.city')}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address?.city && (
                    <p className="text-red-400 text-sm mt-1">{errors.address.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    State/Province
                  </label>
                  <input
                    {...register('address.state')}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address?.state && (
                    <p className="text-red-400 text-sm mt-1">{errors.address.state.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    {...register('address.postalCode')}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address?.postalCode && (
                    <p className="text-red-400 text-sm mt-1">{errors.address.postalCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    {...register('address.country')}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Privacy
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('address.privacy')}
                      value="public"
                      className="bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-300">Show full address</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      {...register('address.privacy')}
                      value="city_only"
                      className="bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-300">Show only city and state</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Notification Preferences</h2>

            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('notificationPreferences.email')}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-300">Email notifications</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('notificationPreferences.sms')}
                  disabled={!user.mobile}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500 disabled:opacity-50"
                />
                <span className="ml-2 text-gray-300">
                  SMS notifications
                  {!user.mobile && (
                    <span className="text-xs text-gray-400 ml-2">
                      (Requires verified mobile number)
                    </span>
                  )}
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;