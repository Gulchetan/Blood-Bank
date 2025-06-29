import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Disclaimer from './components/Disclaimer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import BloodSearch from './pages/BloodSearch';
import DonateBlood from './pages/DonateBlood';
import DonorList from './pages/DonorList';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<BloodSearch />} />
                <Route path="/donate" element={<DonateBlood />} />
                <Route path="/donors" element={<DonorList />} />
                <Route path="/auth" element={<Auth />} />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <Disclaimer variant="footer" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 