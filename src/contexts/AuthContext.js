import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Send OTP to email
  const signUpWithEmail = async (email) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
      });
      
      if (error) throw error;
      
      return { success: true, message: 'OTP sent to your email' };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Verify OTP and sign in
  const verifyOTP = async (email, token) => {
    try {
      setAuthError(null);
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: 'email'
      });
      
      if (error) throw error;
      
      return { success: true, user: data.user };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setAuthError(error.message);
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      setAuthError(null);
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const value = {
    user,
    loading,
    authError,
    signUpWithEmail,
    verifyOTP,
    signOut,
    updateProfile,
    clearError: () => setAuthError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 