import { useLocation } from '../context/LocationContext';
import { formatCurrency } from '../lib/data/locations';

export function usePrice() {
  const { location } = useLocation();
  
  if (!location) {
    throw new Error('Location context not available');
  }

  return {
    format: (amount: number) => formatCurrency(amount, location.country.currencies[0]),
    currency: location.country.currencies[0],
  };
}