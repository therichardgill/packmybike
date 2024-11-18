import { useState, useEffect } from 'react';

let isScriptLoading = false;
let isScriptLoaded = false;
const callbacks: (() => void)[] = [];

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function loadGoogleMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (window.google?.maps?.places) {
      isScriptLoaded = true;
      resolve();
      return;
    }

    // If script is loading, add to callback queue
    if (isScriptLoading) {
      callbacks.push(resolve);
      return;
    }

    // Start loading the script
    isScriptLoading = true;
    const script = document.createElement('script');
    
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('Google Maps API key is not set in environment variables');
      reject(new Error('Google Maps API key is missing'));
      return;
    }

    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Define the callback function
    window.initMap = () => {
      isScriptLoaded = true;
      isScriptLoading = false;
      resolve();
      // Execute any queued callbacks
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };

    script.onerror = () => {
      isScriptLoading = false;
      reject(new Error('Failed to load Google Maps script'));
      callbacks.length = 0;
    };

    document.head.appendChild(script);
  });
}

export function useGoogleMapsScript() {
  const [isLoaded, setIsLoaded] = useState(isScriptLoaded);

  useEffect(() => {
    if (!isLoaded) {
      loadGoogleMapsScript()
        .then(() => setIsLoaded(true))
        .catch(error => {
          console.error('Error loading Google Maps:', error);
          setIsLoaded(false);
        });
    }
  }, [isLoaded]);

  return isLoaded;
}

// Add type definitions for the Google Maps objects
declare global {
  interface Window {
    google?: typeof google;
    initMap?: () => void;
  }
}