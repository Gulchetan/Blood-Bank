import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchDonors();
  }, []);

  useEffect(() => {
    filterAndSortDonors();
  }, [donors, searchTerm, sortBy]);

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
        status: 'active'
      }));

      setDonors(donorsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching donors:', error);
      setLoading(false);
    }
  };

  const filterAndSortDonors = () => {
    let filtered = donors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(donor => 
        donor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.bloodType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort donors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'bloodType':
          return (a.bloodType || '').localeCompare(b.bloodType || '');
        case 'city':
          return (a.city || '').localeCompare(b.city || '');
        case 'date':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

    setFilteredDonors(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200';
      case 'inactive':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
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
            Blood Donors Directory
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            View all registered blood donors in our network. Connect with donors and help save lives.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blood-red mb-1">{donors.length}</div>
            <div className="text-gray-600 dark:text-gray-300">Total Donors</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {donors.filter(d => d.isAvailable).length}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Available</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {new Set(donors.map(d => d.city).filter(Boolean)).size}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Cities</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {new Set(donors.map(d => d.bloodType).filter(Boolean)).size}
            </div>
            <div className="text-gray-600 dark:text-gray-300">Blood Types</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Donors
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, city, or blood type"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="name">Name</option>
                <option value="bloodType">Blood Type</option>
                <option value="city">City</option>
                <option value="date">Registration Date</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchDonors}
                className="btn-primary w-full"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Donors List */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Donors ({filteredDonors.length})
            </h2>
          </div>

          {filteredDonors.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No donors found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'No donors have registered yet.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Donor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Blood Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blood-red rounded-full flex items-center justify-center text-white font-bold">
                            {donor.name?.charAt(0) || 'D'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {donor.name || 'Anonymous'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blood-light dark:bg-red-900/20 text-blood-red">
                          {donor.bloodType || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>
                          <div>{donor.city || 'City not specified'}</div>
                          {donor.location && (
                            <div className="text-gray-500 dark:text-gray-400 text-xs">{donor.location}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div>
                          <div>{donor.email || 'Email not provided'}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-xs">{donor.phone || 'Phone not provided'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(donor.status)}`}>
                          {donor.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(donor.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blood-red hover:text-blood-dark">
                            Contact
                          </button>
                          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Blood Type Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Blood Type Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bloodType => {
              const count = donors.filter(d => d.bloodType === bloodType).length;
              const percentage = donors.length > 0 ? Math.round((count / donors.length) * 100) : 0;
              
              return (
                <div key={bloodType} className="text-center">
                  <div className="text-2xl font-bold text-blood-red mb-1">{count}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">{bloodType}</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blood-red h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorList; 