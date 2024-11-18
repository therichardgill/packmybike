import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, Shield, Award, MessageCircle, Calendar, CheckCircle } from 'lucide-react';
import { FEATURED_LISTINGS, RECENT_LISTINGS } from '../data/listings';
import ListingCard from '../components/ListingCard';

const OwnerProfile: React.FC = () => {
  const { id } = useParams();
  const listings = [...FEATURED_LISTINGS, ...RECENT_LISTINGS];
  const ownerListings = listings.filter(listing => listing.owner.id === id);
  
  // Mock owner data - replace with actual API call
  const owner = {
    id,
    firstName: 'Sarah',
    lastName: 'Wilson',
    joinedDate: new Date('2023-01-15'),
    location: 'Portland, OR',
    bio: 'Passionate cyclist and outdoor enthusiast. I love helping fellow riders travel with their bikes safely and conveniently.',
    responseRate: 98,
    responseTime: '< 1 hour',
    languages: ['English', 'Spanish'],
    verifications: ['Email', 'Phone', 'Government ID'],
    totalReviews: 89,
    averageRating: 4.8,
    trusted: true,
  };

  const stats = [
    { label: 'Listings', value: ownerListings.length },
    { label: 'Reviews', value: owner.totalReviews },
    { label: 'Avg. Rating', value: owner.averageRating },
    { label: 'Response Rate', value: `${owner.responseRate}%` },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-4xl font-medium text-gray-300">
                  {owner.firstName.charAt(0)}
                  {owner.lastName.charAt(0)}
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-grow">
              <div className="flex items-center space-x-4 mb-4">
                <h1 className="text-3xl font-bold text-white">
                  {owner.firstName} {owner.lastName}
                </h1>
                {owner.trusted && (
                  <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Trusted Owner
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {owner.joinedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {owner.location}
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-500 mr-1" />
                  {owner.averageRating} ({owner.totalReviews} reviews)
                </div>
              </div>

              <p className="text-gray-300 mb-6">{owner.bio}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Owner Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Response Info */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">Response Info</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Response Rate</span>
                <span className="text-white font-medium">{owner.responseRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Response Time</span>
                <span className="text-white font-medium">{owner.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">Languages</h2>
            <div className="flex flex-wrap gap-2">
              {owner.languages.map((language, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </div>

          {/* Verifications */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-4">Verifications</h2>
            <div className="space-y-2">
              {owner.verifications.map((verification, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  {verification}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Listings */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">
            {owner.firstName}'s Listings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownerListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} view="grid" />
            ))}
          </div>
          {ownerListings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No listings available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;