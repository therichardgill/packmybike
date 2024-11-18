import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ListingCard from '../components/ListingCard';
import { FEATURED_LISTINGS } from '../data/listings';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Simulate user's listings
  const userListings = FEATURED_LISTINGS.slice(0, 2);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">My Listings</h1>
          <button
            onClick={() => navigate('/listings/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Listing</span>
          </button>
        </div>

        {userListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} view="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              No Listings Yet
            </h2>
            <p className="text-gray-400 mb-6">
              Start earning by listing your bike bag for rent
            </p>
            <button
              onClick={() => navigate('/listings/new')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition duration-200 inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Listing</span>
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <Star className="w-8 h-8 text-yellow-500" />
          <div>
            <h2 className="text-xl font-bold text-white">Listing Stats</h2>
            <p className="text-gray-400">Track your listing performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total Views</h3>
            <p className="text-3xl font-bold text-blue-400">247</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Active Rentals
            </h3>
            <p className="text-3xl font-bold text-green-400">3</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-yellow-400">$420</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;