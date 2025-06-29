# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication with OTP (One-Time Password) functionality for your Blood Bank application.

## 🚀 Features Implemented

- **Email Authentication with OTP** - Users can authenticate with their email address
- **Authentication Context** - Manages user state across the app
- **Protected Routes** - Secures certain pages requiring authentication
- **User Profile Management** - Users can view and update their profile
- **Modern UI** - Beautiful, responsive design with dark mode support

## 📋 Prerequisites

1. **Supabase Account** - Sign up at [supabase.com](https://supabase.com)
2. **Node.js** - Version 14 or higher
3. **React** - Already configured in your project

## 🔧 Setup Instructions

### 1. Supabase Project Configuration

#### Enable Authentication in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Settings**
3. Configure the following settings:

**Email Auth Settings:**
- ✅ Enable "Enable email confirmations"
- ✅ Enable "Enable email change confirmations"
- ✅ Enable "Enable secure email change"
- Set **Site URL** to: `http://localhost:3000` (for development)
- Set **Redirect URLs** to: `http://localhost:3000/auth`

### 2. Environment Variables

Create or update your `.env` file in the root directory:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**To find these values:**
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key

### 3. Update Supabase Configuration

Update `src/supabase.js` to use environment variables:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase };
export default supabase;
```

### 4. Database Schema (Optional)

If you want to store additional user data, create a `profiles` table:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  blood_type TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
```

## 🧪 Testing the Authentication

### 1. Start the Development Server

```bash
npm start
```

### 2. Test Email Authentication

1. Navigate to `/auth`
2. Enter a valid email address
3. Click "Send OTP to Email"
4. Check your email for the OTP code
5. Enter the OTP and click "Verify OTP"

### 3. Test Protected Routes

1. Authenticate using email OTP
2. Navigate to `/profile` - should be accessible
3. Sign out
4. Try to access `/profile` - should redirect to `/auth`

## 🔒 Security Considerations

### Production Deployment

1. **Update Site URL and Redirect URLs** in Supabase dashboard
2. **Set up email templates** for better user experience
3. **Enable additional security features**:
   - Two-factor authentication
   - Password policies
   - Rate limiting

### Environment Variables

- Never commit `.env` files to version control
- Use different Supabase projects for development and production
- Rotate API keys regularly

## 📱 Free Tier Limitations

Supabase free tier includes:
- ✅ **Email Authentication with OTP** - Unlimited
- ✅ **User Management** - Up to 50,000 users
- ✅ **Database** - 500MB storage
- ✅ **API Calls** - 50,000 per month

## 🐛 Troubleshooting

### Common Issues

1. **OTP not received**
   - Check spam folder for emails
   - Verify email address is correct
   - Check Supabase dashboard for email delivery status

2. **Authentication errors**
   - Verify environment variables are set correctly
   - Check Supabase project settings
   - Ensure redirect URLs are configured properly

3. **Protected routes not working**
   - Verify AuthProvider is wrapping your app
   - Check user state in browser console
   - Ensure ProtectedRoute component is imported correctly

### Debug Mode

Enable debug logging in your browser console:

```javascript
// Add this to your supabase.js file for debugging
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    debug: true
  }
});
```

## 🎉 Success!

Your Blood Bank application now has:
- ✅ Secure OTP-based authentication with email
- ✅ User profile management
- ✅ Protected routes
- ✅ Modern, responsive UI
- ✅ Dark mode support

Users can now authenticate using their email address with OTP verification, making your application secure and user-friendly!

## 📚 Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [React Context API](https://reactjs.org/docs/context.html)
- [React Router](https://reactrouter.com/) 