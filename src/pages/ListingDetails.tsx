import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, MessageCircle, ThumbsUp, 
  Calendar, Shield, Bike, Scale, Ruler, Lock
} from 'lucide-react';
import { FEATURED_LISTINGS, RECENT_LISTINGS } from '../data/listings';
import ShareListing from '../components/ShareListing';

const ListingDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const listing = [...FEATURED_LISTINGS, ...RECENT_LISTINGS].find(l => l.id === Number(id));

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Listing not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-400 hover:text-blue-300 flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to listings</span>
          </button>
        </div>
      </div>
    );
  }

  const renderProtectionLevel = (level: number) => {
    return Array(5).fill(0).map((_, index) => (
      <div
        key={index}
        className={`w-4 h-2 rounded ${
          index < level ? 'bg-green-500' : 'bg-gray-600'
        }`}
      />
    ));
  };

  const renderTransportRating = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <div
        key={index}
        className={`w-4 h-2 rounded ${
          index < rating ? 'bg-blue-500' : 'bg-gray-600'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-blue-400 hover:text-blue-300 flex items-center space-x-2 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to listings</span>
        </button>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl">
          <div className="relative h-96">
            <img
              src={listing.image}
              alt={listing.bagSpecs.model}
              className="w-full h-full object-cover"
            />
            {listing.featured && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full">
                Featured Listing
              </div>
            )}
          </div>

          <div className="p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {listing.bagSpecs.model}
                </h1>
                <div className="flex items-center space-x-4 text-gray-300">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-1" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 mr-1" />
                    <span>{listing.rating} ({listing.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-400">
                ${listing.price}/day
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
                  <p className="text-gray-300">{listing.description}</p>
                  
                  <div className="mt-6 flex items-center space-x-4 text-gray-300">
                    <div className="flex items-center">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span>{listing.upvotes} upvotes</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      <span>{listing.reviews} reviews</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-white mb-4">Bag Specifications</h2>
                  <div className="bg-gray-700/50 rounded-lg p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-2">
                        {listing.bagSpecs.brand} {listing.bagSpecs.model}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Bike Compatibility</h4>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(listing.bagSpecs.bikeCompatibility).map(([type, compatible]) => (
                            compatible && (
                              <span
                                key={type}
                                className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                              >
                                <Bike className="w-4 h-4 mr-1" />
                                {type.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            )
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Protection Level</h4>
                        <div className="flex space-x-1">
                          {renderProtectionLevel(listing.bagSpecs.protectionLevel)}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Transport Rating</h4>
                        <div className="flex space-x-1">
                          {renderTransportRating(listing.bagSpecs.transportRating)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            <Scale className="w-4 h-4 inline mr-1" />
                            Weight Capacity
                          </h4>
                          <p className="text-gray-200">
                            Empty: {listing.bagSpecs.weight.empty}kg
                            <br />
                            Max Load: {listing.bagSpecs.weight.maxLoad}kg
                          </p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-400 mb-2">
                            <Ruler className="w-4 h-4 inline mr-1" />
                            Wheel Size
                          </h4>
                          <p className="text-gray-200">
                            {listing.bagSpecs.wheelSize.min}" - {listing.bagSpecs.wheelSize.max}"
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                          <Lock className="w-4 h-4 inline mr-1" />
                          Security Features
                        </h4>
                        <ul className="list-disc list-inside text-gray-200">
                          {listing.bagSpecs.securityFeatures.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-700/50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Book Now</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Pickup Date</label>
                        <input
                          type="date"
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-2">Return Date</label>
                        <input
                          type="date"
                          className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-200">
                      Request Booking
                    </button>
                  </div>

                  <div className="mt-6 space-y-3 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Free cancellation up to 24 hours before pickup</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Insurance included in rental price</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Share this listing</h3>
                  <ShareListing listing={listing} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;