import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { FirebaseError } from 'firebase/app';

const signUpSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpInputs = z.infer<typeof signUpSchema>;

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInputs) => {
    try {
      setAuthError(null);
      await signUp(data.email, data.password, data.firstName, data.lastName);
      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setAuthError('This email is already registered. Please sign in instead.');
            break;
          case 'auth/invalid-email':
            setAuthError('Invalid email address.');
            break;
          case 'auth/operation-not-allowed':
            setAuthError('Email/password accounts are not enabled. Please contact support.');
            break;
          case 'auth/weak-password':
            setAuthError('Password is too weak. Please choose a stronger password.');
            break;
          default:
            setAuthError('An error occurred during sign up. Please try again.');
        }
      } else {
        setAuthError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-primary-300" />
              <span className="text-xl font-bold text-gray-900">packmybike</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
              <p className="mt-2 text-gray-600">
                Already have an account?{' '}
                <Link to="/sign-in" className="text-primary-300 hover:text-primary-400">
                  Sign in
                </Link>
              </p>
            </div>

            {authError && (
              <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <input
                    {...register('firstName')}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <input
                    {...register('lastName')}
                    className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm password
                </label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-700 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-300 hover:bg-primary-400 text-gray-900 font-medium py-2.5 rounded-lg transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>

              <p className="text-sm text-gray-500 text-center">
                By signing up, you agree to our{' '}
                <Link to="/terms" className="text-primary-300 hover:text-primary-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-300 hover:text-primary-400">
                  Privacy Policy
                </Link>
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} packmybike. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default SignUp;