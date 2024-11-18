import React, { useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { UseFormSetValue } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { useGoogleMapsScript } from '../utils/googleMaps';

interface AddressAutocompleteProps {
  setValue: UseFormSetValue<any>;
  defaultValue?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  setValue,
  defaultValue = '',
}) => {
  const isScriptLoaded = useGoogleMapsScript();

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue: setAddressValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['address'],
      componentRestrictions: { country: ['us', 'ca', 'gb', 'au', 'nz', 'ie'] },
    },
    debounce: 300,
    cache: 86400,
    initOnMount: isScriptLoaded,
  });

  // Set initial value if provided
  useEffect(() => {
    if (defaultValue && ready) {
      setAddressValue(defaultValue, false);
    }
  }, [defaultValue, ready, setAddressValue]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressValue(e.target.value);
  };

  const handleSelect = async (suggestion: google.maps.places.AutocompletePrediction) => {
    setAddressValue(suggestion.description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: suggestion.description });
      const { lat, lng } = await getLatLng(results[0]);
      
      // Parse address components
      const addressComponents = results[0].address_components;
      const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || '';
      const route = addressComponents.find(c => c.types.includes('route'))?.long_name || '';
      const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
      const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.short_name || '';
      const postalCode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || '';
      const country = addressComponents.find(c => c.types.includes('country'))?.long_name || '';
      const unit = addressComponents.find(c => c.types.includes('subpremise'))?.long_name || '';

      // Update form values
      setValue('address.street', `${streetNumber} ${route}`.trim());
      setValue('address.unit', unit);
      setValue('address.city', city);
      setValue('address.state', state);
      setValue('address.postalCode', postalCode);
      setValue('address.country', country);
      setValue('address.coordinates', { lat, lng });
    } catch (error) {
      console.error('Error selecting address:', error);
    }
  };

  if (!isScriptLoaded || !ready) {
    return (
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          disabled
          className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 opacity-50"
          placeholder="Loading address search..."
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          value={value}
          onChange={handleInput}
          className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
          placeholder="Start typing your address..."
        />
      </div>
      
      {status === 'OK' && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
          {data.map(suggestion => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
              <li
                key={place_id}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
              >
                <strong className="text-white">{main_text}</strong>
                <span className="text-gray-400 ml-1">{secondary_text}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;