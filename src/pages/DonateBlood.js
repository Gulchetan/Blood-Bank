import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const DonateBlood = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    city: '',
    location: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  
  // OTP Authentication states
  const [showOtpStep, setShowOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  // Check if user is already authenticated in this session
  const [sessionVerified, setSessionVerified] = useState(() => {
    return sessionStorage.getItem('donorEmailVerified') === 'true';
  });

  // Pre-fill email from session storage if available
  useEffect(() => {
    const savedEmail = sessionStorage.getItem('donorEmail');
    if (savedEmail && sessionVerified) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail
      }));
      setEmailVerified(true);
    }
  }, [sessionVerified]);

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Send OTP to email
  const sendOTP = async (email) => {
    setLoading(true);
    setAuthMessage('');
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      
      if (error) {
        setAuthMessage(`Error: ${error.message}`);
        setLoading(false);
        return false;
      }
      
      setAuthMessage('OTP sent successfully! Check your email.');
      setOtpSent(true);
      setLoading(false);
      return true;
    } catch (error) {
      setAuthMessage(`Error: ${error.message}`);
      setLoading(false);
      return false;
    }
  };

  // Verify OTP
  const verifyOTP = async (email, otpToken) => {
    setLoading(true);
    setAuthMessage('');
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otpToken,
        type: 'email'
      });
      
      if (error) {
        setAuthMessage(`Error: ${error.message}`);
        setLoading(false);
        return false;
      }
      
      setAuthMessage('Email verified successfully!');
      setEmailVerified(true);
      setLoading(false);
      setSessionVerified(true);
      // Store in session storage to prevent re-authentication
      sessionStorage.setItem('donorEmailVerified', 'true');
      sessionStorage.setItem('donorEmail', email);
      return true;
    } catch (error) {
      setAuthMessage(`Error: ${error.message}`);
      setLoading(false);
      return false;
    }
  };

  // Handle email verification step
  const handleEmailVerification = async (e) => {
    e.preventDefault();
    
    if (!formData.email.trim()) {
      setAuthMessage('Please enter your email address.');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setAuthMessage('Please enter a valid email address.');
      return;
    }

    const success = await sendOTP(formData.email);
    if (success) {
      setShowOtpStep(true);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setAuthMessage('Please enter the OTP.');
      return;
    }

    const success = await verifyOTP(formData.email, otp);
    if (success) {
      setShowOtpStep(false);
      setOtpSent(false);
      setEmailVerified(true);
      setSessionVerified(true);
      // Store in session storage to prevent re-authentication
      sessionStorage.setItem('donorEmailVerified', 'true');
      sessionStorage.setItem('donorEmail', formData.email);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    await sendOTP(formData.email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    // Phone number validation - required and must be exactly 10 digits
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Phone number must be exactly 10 digits';
    
    if (!formData.bloodType) newErrors.bloodType = 'Blood type is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const donorData = {
        Donor_name: formData.name,
        email: formData.email,
        phone_number: parseInt(formData.phone) || null,
        Blood_group: formData.bloodType,
        City: formData.city,
        Location: formData.location
      };

      const { error } = await supabase
        .from('Donor')
        .insert([donorData]);

      if (error) {
        console.error('Error adding donor:', error);
        setErrors({ submit: 'Failed to register. Please try again.' });
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        bloodType: '',
        city: '',
        location: ''
      });
      setEmailVerified(false);
      setOtpSent(false);
      setShowOtpStep(false);
      setOtp('');
      setAuthMessage('');
      // Clear session storage after successful registration
      sessionStorage.removeItem('donorEmailVerified');
      sessionStorage.removeItem('donorEmail');
    } catch (error) {
      console.error('Error adding donor:', error);
      setErrors({ submit: 'Failed to register. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Email verification step
  if (!emailVerified && !sessionVerified) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Email Verification Required
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please verify your email address to continue with donor registration.
            </p>
          </div>

          <div className="card">
            {!showOtpStep ? (
              // Email input step
              <form onSubmit={handleEmailVerification} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {authMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    authMessage.includes('Error') 
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                      : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                  }`}>
                    {authMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !formData.email.trim()}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              // OTP verification step
              <form onSubmit={handleOtpVerification} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="input-field"
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    We've sent a 6-digit code to {formData.email}
                  </p>
                </div>

                {authMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    authMessage.includes('Error') 
                      ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                      : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                  }`}>
                    {authMessage}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading || !otp.trim()}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtpStep(false);
                      setOtpSent(false);
                      setOtp('');
                      setAuthMessage('');
                    }}
                    className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Change Email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="card text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Thank You for Your Generosity!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your blood donation registration has been successfully completed. You are now part of our lifesaving network and will be contacted when there's a need for your blood type in your area.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <p className="text-green-800 dark:text-green-200 text-sm">
                <strong>What happens next?</strong><br/>
                • You'll receive a confirmation email<br/>
                • We'll contact you when there's a need for your blood type<br/>
                • You can update your information anytime
              </p>
            </div>
            <button
              onClick={() => {
                setSuccess(false);
                setSessionVerified(false);
                setEmailVerified(false);
                sessionStorage.removeItem('donorEmailVerified');
                sessionStorage.removeItem('donorEmail');
              }}
              className="btn-primary w-full"
            >
              Register Another Donor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Become a Blood Donor
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join our network of lifesavers. Your donation can make all the difference for someone in need.
          </p>
        </div>

        <div className="card">
          {/* Email verification success message */}
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-green-500 text-lg">✓</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800 dark:text-green-200">
                  Email verified successfully! You can now complete your donor registration.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`input-field ${errors.email ? 'border-red-500' : ''} pr-10`}
                      placeholder="Enter your email"
                      readOnly
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-green-500 text-sm">✓ Verified</span>
                    </div>
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Enter your 10-digit phone number"
                    maxLength="10"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blood Type *
                  </label>
                  <select
                    value={formData.bloodType}
                    onChange={(e) => handleInputChange('bloodType', e.target.value)}
                    className={`input-field ${errors.bloodType ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select blood type</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.bloodType && <p className="text-red-500 text-sm mt-1">{errors.bloodType}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Location Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="Enter your city"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location/Address
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="input-field"
                    placeholder="Enter your address or location"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              {errors.submit && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{errors.submit}</p>
                </div>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Registering...' : 'Register as Blood Donor'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Donation Requirements</h3>
            <ul className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
              <li>• Age between 18-65 years</li>
              <li>• Weight at least 50kg (110 lbs)</li>
              <li>• Good general health</li>
              <li>• No recent surgeries or illnesses</li>
              <li>• Not pregnant or recently given birth</li>
            </ul>
          </div>

          <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">Benefits of Donating</h3>
            <ul className="text-green-800 dark:text-green-200 space-y-2 text-sm">
              <li>• Save up to 3 lives per donation</li>
              <li>• Free health checkup</li>
              <li>• Reduce risk of heart disease</li>
              <li>• Help maintain healthy iron levels</li>
              <li>• Feel good about helping others</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateBlood; 