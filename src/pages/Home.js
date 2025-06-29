import React from 'react';
import { Link } from 'react-router-dom';
import Disclaimer from '../components/Disclaimer';

const Home = () => {
  const features = [
    {
      title: 'Find Blood Donors',
      description: 'Quickly locate blood donors in your area with our advanced search system.',
      icon: '🔍',
      path: '/search'
    },
    {
      title: 'Donate Blood',
      description: 'Register as a blood donor and help save lives in your community.',
      icon: '❤️',
      path: '/donate'
    },
    {
      title: 'Emergency Response',
      description: '24/7 emergency blood request system for urgent medical needs.',
      icon: '🚨',
      path: '/search'
    },
    {
      title: 'Track Donations',
      description: 'Keep track of your blood donation history and impact.',
      icon: '📊',
      path: '/donors'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Disclaimer Banner */}
      <Disclaimer variant="banner" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Save Lives Through
              <span className="block text-red-200 mt-2">Blood Donation</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Connect blood donors with those in need. Every drop counts, every donor matters.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                to="/search"
                className="inline-block bg-white text-red-600 font-semibold text-lg px-8 py-3 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Find Blood Donors
              </Link>
              <Link
                to="/donate"
                className="inline-block border-2 border-white text-white font-semibold text-lg px-8 py-3 rounded-lg hover:bg-white hover:text-red-600 transform hover:scale-105 transition-all duration-200"
              >
                Become a Donor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How We Help Save Lives
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Our platform connects blood donors with patients in need, making the process simple and efficient.
            </p>
          </div>
          
          {/* Feature Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.path}
                className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:shadow-gray-900/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-4 text-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-red-600 transition-colors duration-200 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Join thousands of donors who are saving lives every day. Your donation can make all the difference.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/donate"
              className="inline-block bg-white text-red-600 font-semibold text-lg px-8 py-3 rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Start Donating Today
            </Link>
            <Link
              to="/search"
              className="inline-block border-2 border-white text-white font-semibold text-lg px-8 py-3 rounded-lg hover:bg-white hover:text-red-600 transform hover:scale-105 transition-all duration-200"
            >
              Find Blood Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;