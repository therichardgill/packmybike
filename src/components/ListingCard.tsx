import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import type { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  view: 'grid' | 'list';
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <Link 
      to={`/listing/${listing.id}`}
      className="group block bg-white rounded-xl overflow-hidden transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg border border-gray-100"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={`${listing.bagSpecs.model} bike bag`}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900">
            {listing.bagSpecs.model}
          </h3>
          <div className="flex items-center text-gray-900">
            <Star className="w-4 h-4 fill-current text-yellow-400" />
            <span className="ml-1 text-sm">{listing.rating}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{listing.location}</span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-primary-500 font-medium">
            ${listing.pricingSchedule.dailyRate}/day
          </span>
          <span className="text-sm text-gray-500">
            {listing.reviews} reviews
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;