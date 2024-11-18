import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LOCATIONS, DEFAULT_LOCATION, getCountryByCode } from '../lib/data/locations';
import type { Location, Country } from '../types';

interface LocationContextType {
  location: Location | null;
  setUserLocation: (country: Country) => void;
  isLoading: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (storedLocation) {
      try {
        const parsed = JSON.parse(storedLocation);
        const country = getCountryByCode(parsed.country.code);
        if (country) {
          setLocation({ country, detected: false });
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.warn('Invalid stored location');
      }
    }

    // Fallback function to use IP-based location
    const detectLocationByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.country) {
          const country = getCountryByCode(data.country);
          if (country) {
            const detectedLocation = { country, detected: true };
            setLocation(detectedLocation);
            localStorage.setItem('userLocation', JSON.stringify(detectedLocation));
            return;
          }
        }
        throw new Error('Invalid location data');
      } catch (error) {
        console.warn('Failed to detect location, using default');
        const defaultLocation = { country: DEFAULT_LOCATION, detected: false };
        setLocation(defaultLocation);
        localStorage.setItem('userLocation', JSON.stringify(defaultLocation));
      } finally {
        setIsLoading(false);
      }
    };

    detectLocationByIP();
  }, []);

  const setUserLocation = (country: Country) => {
    const newLocation = { country, detected: false };
    setLocation(newLocation);
    localStorage.setItem('userLocation', JSON.stringify(newLocation));
  };

  return (
    <LocationContext.Provider value={{ location, setUserLocation, isLoading }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}