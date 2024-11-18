import React from 'react';
import { AlertTriangle, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EmailVerificationBanner: React.FC = () => {
  const { user, resendVerificationEmail } = useAuth();

  if (!user || user.verifiedEmail) {
    return null;
  }

  const handleResend = async () => {
    try {
      await resendVerificationEmail();
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert('Failed to send verification email. Please try again later.');
    }
  };

  return (
    <div className="bg-yellow-500/10 border-t border-b border-yellow-500/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <p className="text-yellow-200">
              Please verify your email address to access all features
            </p>
          </div>
          <button
            onClick={handleResend}
            className="flex items-center space-x-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-200 px-4 py-1 rounded-lg transition duration-200"
          >
            <Mail className="w-4 h-4" />
            <span>Resend Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;