import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { FEATURED_LISTINGS, RECENT_LISTINGS } from '../data/listings';

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredListings, setFilteredListings] = useState([...FEATURED_LISTINGS, ...RECENT_LISTINGS]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filtered = [...FEATURED_LISTINGS, ...RECENT_LISTINGS].filter(listing =>
      listing.bagSpecs.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredListings(filtered);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b border-gray-100">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center max-w-3xl mx-auto leading-tight">
            Find the perfect bike bag for your next adventure
          </h1>
          <p className="mt-6 text-xl text-gray-600 text-center max-w-2xl mx-auto">
            Rent from trusted cyclists in your area
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-12 max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bike bags..."
                className="w-full h-14 pl-14 pr-6 text-lg rounded-full border border-gray-200 focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20 transition-all duration-200"
              />
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </form>

          {/* Quick Stats */}
          <div className="mt-12 flex justify-center space-x-12">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">1,000+</p>
              <p className="text-gray-600">Bike Bags</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">500+</p>
              <p className="text-gray-600">Happy Cyclists</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">50+</p>
              <p className="text-gray-600">Cities</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? 'Search Results' : 'Popular Right Now'}
          </h2>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} view="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No listings found for "{searchQuery}". Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;