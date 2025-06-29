import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const { 
    signUpWithEmail, 
    verifyOTP, 
    authError, 
    clearError 
  } = useAuth();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    clearError();

    if (!showOtpInput) {
      // Send OTP
      const result = await signUpWithEmail(email);

      if (result.success) {
        setMessage(result.message);
        setShowOtpInput(true);
      } else {
        setMessage(result.error);
      }
    } else {
      // Verify OTP
      const result = await verifyOTP(email, otp);
      if (result.success) {
        setMessage('Authentication successful!');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setMessage(result.error);
      }
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage('');
    clearError();

    const result = await signUpWithEmail(email);

    if (result.success) {
      setMessage('OTP resent successfully!');
    } else {
      setMessage(result.error);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setEmail('');
    setOtp('');
    setShowOtpInput(false);
    setMessage('');
    clearError();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to Blood Bank
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Enter your email to receive a verification code
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          {!showOtpInput && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          )}

          {/* OTP Input */}
          {showOtpInput && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter OTP
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm bg-white dark:bg-gray-700"
                />
              </div>
              <div className="mt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtpInput(false)}
                  className="text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Change Email
                </button>
              </div>
            </div>
          )}

          {/* Error/Success Message */}
          {(authError || message) && (
            <div className={`rounded-md p-4 ${
              authError ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            }`}>
              <p className={`text-sm ${
                authError ? 'text-red-800 dark:text-red-200' : 'text-green-800 dark:text-green-200'
              }`}>
                {authError || message}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading || (!showOtpInput && !email) || (showOtpInput && !otp)}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                showOtpInput ? 'Verify OTP' : 'Send OTP to Email'
              )}
            </button>
          </div>
        </form>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
            Demo Information
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            For testing purposes, you can use any valid email address. 
            Supabase will send a real OTP to the provided email address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth; 