import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Eye, Star, MapPin, DollarSign, Clock, ShoppingBag } from 'lucide-react';
import { FEATURED_LISTINGS, RECENT_LISTINGS } from '../data/listings';
import { useBrands } from '../context/BrandContext';
import { usePrice } from '../utils/currency';
import type { Listing } from '../types';
import EditListingModal from './EditListingModal';

const ListingManagement: React.FC = () => {
  const navigate = useNavigate();
  const [listings] = useState<Listing[]>([...FEATURED_LISTINGS, ...RECENT_LISTINGS]);
  const { brands } = useBrands();
  const { format: formatPrice } = usePrice();
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const getBagDetails = (listing: Listing) => {
    const brand = brands.find(b => b.name === listing.bagSpecs.brand);
    return brand?.bags?.find(b => b.model === listing.bagSpecs.model) || null;
  };

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
  };

  const handleDelete = (listingId: number) => {
    if (window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      // TODO: Implement delete functionality
      console.log('Delete listing:', listingId);
    }
  };

  const handleView = (listingId: number) => {
    navigate(`/listing/${listingId}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-gray-700">
              <th className="pb-3 text-gray-400 font-medium">Listing</th>
              <th className="pb-3 text-gray-400 font-medium">Owner</th>
              <th className="pb-3 text-gray-400 font-medium">Location</th>
              <th className="pb-3 text-gray-400 font-medium">Price</th>
              <th className="pb-3 text-gray-400 font-medium">Status</th>
              <th className="pb-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {listings.map((listing) => (
              <tr key={listing.id} className="group hover:bg-gray-700/30">
                <td className="py-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <img
                        src={listing.image}
                        alt={`${listing.bagSpecs.model}`}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {listing.bagSpecs.model}
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {listing.rating} ({listing.reviews} reviews)
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="text-white">
                    {listing.owner.firstName} {listing.owner.lastName}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {listing.location}
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center text-gray-400">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {formatPrice(listing.pricingSchedule.dailyRate)}/day
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      listing.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {listing.available ? 'Available' : 'Unavailable'}
                  </span>
                  {listing.featured && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </td>
                <td className="py-4">
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleView(listing.id)}
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="View listing"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(listing)}
                      className="p-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                      title="Edit listing"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(listing.id)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Delete listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Listings Found</h3>
          <p className="text-gray-400">There are no listings in the system yet.</p>
        </div>
      )}

      {selectedListing && (
        <EditListingModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onSave={(updatedListing) => {
            // TODO: Implement save functionality
            console.log('Save listing:', updatedListing);
            setSelectedListing(null);
          }}
        />
      )}
    </div>
  );
};

export default ListingManagement;