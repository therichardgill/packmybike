import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Key, Mail, Bell, Globe, Save, Eye, EyeOff } from 'lucide-react';

const clerkKeySchema = z.string()
  .regex(
    /^(pk_test_|pk_live_)[a-zA-Z0-9]+$/,
    'Must be a valid Clerk key starting with pk_test_ or pk_live_'
  );

const configSchema = z.object({
  clerk: z.object({
    publishableKey: clerkKeySchema,
    secretKey: z.string()
      .regex(
        /^(sk_test_|sk_live_)[a-zA-Z0-9]+$/,
        'Must be a valid Clerk secret key starting with sk_test_ or sk_live_'
      ),
  }),
  email: z.object({
    provider: z.enum(['smtp', 'sendgrid', 'mailgun']),
    apiKey: z.string().min(1, 'API key is required'),
    fromEmail: z.string().email('Invalid email address'),
    fromName: z.string().min(1, 'From name is required'),
  }),
  sms: z.object({
    provider: z.enum(['twilio', 'messagebird']),
    apiKey: z.string().min(1, 'API key is required'),
    fromNumber: z.string().min(1, 'From number is required'),
  }),
  general: z.object({
    siteName: z.string().min(1, 'Site name is required'),
    siteUrl: z.string().url('Invalid URL'),
    supportEmail: z.string().email('Invalid email address'),
  }),
});

type ConfigInputs = z.infer<typeof configSchema>;

const ConfigurationManager: React.FC = () => {
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfigInputs>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      clerk: {
        publishableKey: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '',
        secretKey: '',
      },
      email: {
        provider: 'smtp',
        apiKey: '',
        fromEmail: 'noreply@example.com',
        fromName: 'BikeBag Rentals',
      },
      sms: {
        provider: 'twilio',
        apiKey: '',
        fromNumber: '',
      },
      general: {
        siteName: 'BikeBag Rentals',
        siteUrl: 'https://bikebag.example.com',
        supportEmail: 'support@example.com',
      },
    },
  });

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit = async (data: ConfigInputs) => {
    try {
      console.log('Saving configuration:', data);
      // TODO: Implement API call to save configuration
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Authentication Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Key className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-white">Authentication (Clerk)</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Publishable Key
            </label>
            <div className="relative">
              <input
                type={showSecrets.publishableKey ? 'text' : 'password'}
                {...register('clerk.publishableKey')}
                className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="pk_test_..."
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('publishableKey')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showSecrets.publishableKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.clerk?.publishableKey && (
              <p className="text-red-400 text-sm mt-1">
                {errors.clerk.publishableKey.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Secret Key
            </label>
            <div className="relative">
              <input
                type={showSecrets.secretKey ? 'text' : 'password'}
                {...register('clerk.secretKey')}
                className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="sk_test_..."
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('secretKey')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showSecrets.secretKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.clerk?.secretKey && (
              <p className="text-red-400 text-sm mt-1">
                {errors.clerk.secretKey.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Email Configuration Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Mail className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Email Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Provider
            </label>
            <select
              {...register('email.provider')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="smtp">SMTP</option>
              <option value="sendgrid">SendGrid</option>
              <option value="mailgun">Mailgun</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              API Key
            </label>
            <div className="relative">
              <input
                type={showSecrets.emailApiKey ? 'text' : 'password'}
                {...register('email.apiKey')}
                className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('emailApiKey')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showSecrets.emailApiKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              From Email
            </label>
            <input
              {...register('email.fromEmail')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              From Name
            </label>
            <input
              {...register('email.fromName')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SMS Configuration Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Bell className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold text-white">SMS Configuration</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              SMS Provider
            </label>
            <select
              {...register('sms.provider')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="twilio">Twilio</option>
              <option value="messagebird">MessageBird</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              API Key
            </label>
            <div className="relative">
              <input
                type={showSecrets.smsApiKey ? 'text' : 'password'}
                {...register('sms.apiKey')}
                className="w-full bg-gray-700 text-white rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('smsApiKey')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showSecrets.smsApiKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              From Number
            </label>
            <input
              {...register('sms.fromNumber')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
            />
          </div>
        </div>
      </div>

      {/* General Settings Section */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Globe className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-white">General Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Site Name
            </label>
            <input
              {...register('general.siteName')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Site URL
            </label>
            <input
              {...register('general.siteUrl')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Support Email
            </label>
            <input
              {...register('general.supportEmail')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
        >
          <Save className="w-5 h-5" />
          <span>Save Configuration</span>
        </button>
      </div>
    </form>
  );
};

export default ConfigurationManager;