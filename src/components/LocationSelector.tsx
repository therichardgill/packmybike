import React, { useState } from 'react';
import { MapPin, Check, Search } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { SUPPORTED_LOCATIONS } from '../lib/data/locations';

const LocationSelector: React.FC = () => {
  const { location, setUserLocation } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!location) return null;

  const filteredLocations = SUPPORTED_LOCATIONS.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
      >
        <span className="text-lg" aria-label={location.country.name}>
          {location.country.flag}
        </span>
        <span className="text-sm font-medium">{location.country.code}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl z-50">
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="max-h-64 overflow-y-auto">
                {filteredLocations.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      setUserLocation(country);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-white">{country.name}</span>
                        <span className="text-sm text-gray-400">
                          {country.currencies[0].code} • {country.currencies[0].symbol}
                        </span>
                      </div>
                    </div>
                    {location.country.code === country.code && (
                      <Check className="w-5 h-5 text-green-400" />
                    )}
                  </button>
                ))}
              </div>

              {filteredLocations.length === 0 && (
                <div className="text-center py-4">
                  <MapPin className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">
                    No supported locations found
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LocationSelector;