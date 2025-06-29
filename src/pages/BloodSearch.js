import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const BloodSearch = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    bloodType: '',
    city: '',
    availability: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    filterDonors();
  }, [donors, filters]);

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('Donor')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donors:', error);
        setLoading(false);
        return;
      }

      // Transform data to match our application structure
      const donorsData = data.map(donor => ({
        id: donor.id,
        name: donor.Donor_name,
        bloodType: donor.Blood_group,
        city: donor.City,
        location: donor.Location,
        email: donor.email,
        phone: donor.phone_number?.toString(),
        createdAt: donor.created_at,
        isAvailable: true, // Default to available since we don't have this field
        availability: 'flexible' // Default availability
      }));

      setDonors(donorsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donors:', error);
      setLoading(false);
    }
  };

  const filterDonors = () => {
    let filtered = donors;

    if (filters.bloodType) {
      filtered = filtered.filter(donor => donor.bloodType === filters.bloodType);
    }

    if (filters.city) {
      filtered = filtered.filter(donor => 
        donor.city?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.availability) {
      filtered = filtered.filter(donor => donor.availability === filters.availability);
    }

    setFilteredDonors(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      bloodType: '',
      city: '',
      availability: ''
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blood-red mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading donors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Blood Donors
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Search for available blood donors in your area. Connect with donors who can help save lives.
          </p>
        </div>

        {/* Search Filters */}
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Search Filters</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blood Type
              </label>
              <select
                value={filters.bloodType}
                onChange={(e) => handleFilterChange('bloodType', e.target.value)}
                className="input-field"
              >
                <option value="">All Blood Types</option>
                {bloodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                placeholder="Enter city name"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Availability
              </label>
              <select
                value={filters.availability}
                onChange={(e) => handleFilterChange('availability', e.target.value)}
                className="input-field"
              >
                <option value="">All</option>
                <option value="immediate">Immediate</option>
                <option value="within_24h">Within 24 hours</option>
                <option value="within_week">Within a week</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn-secondary w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Available Donors ({filteredDonors.length})
            </h2>
            <button
              onClick={fetchDonors}
              className="btn-primary"
            >
              Refresh
            </button>
          </div>

          {filteredDonors.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No donors found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Try adjusting your search filters or check back later.
              </p>
              <button
                onClick={clearFilters}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonors.map((donor) => (
                <div key={donor.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blood-red rounded-full flex items-center justify-center text-white font-bold">
                        {donor.name?.charAt(0) || 'D'}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{donor.name || 'Anonymous'}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{donor.city || 'Location not specified'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block bg-blood-light dark:bg-red-900/20 text-blood-red px-2 py-1 rounded text-sm font-semibold">
                        {donor.bloodType || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{donor.email || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{donor.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Location:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{donor.location || 'Not specified'}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="btn-primary flex-1 text-sm">
                      Contact Donor
                    </button>
                    <button className="btn-secondary text-sm px-3">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      
      </div>
    </div>
  );
};

export default BloodSearch; 