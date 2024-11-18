// Supported locations with their currencies
export const SUPPORTED_LOCATIONS: Country[] = [
  {
    code: 'AU',
    name: 'Australia',
    currencies: [{ code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }],
    flag: '🇦🇺',
  },
  {
    code: 'NZ',
    name: 'New Zealand',
    currencies: [{ code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' }],
    flag: '🇳🇿',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    currencies: [{ code: 'GBP', symbol: '£', name: 'British Pound' }],
    flag: '🇬🇧',
  },
  {
    code: 'US',
    name: 'United States',
    currencies: [{ code: 'USD', symbol: '$', name: 'US Dollar' }],
    flag: '🇺🇸',
  },
  {
    code: 'CA',
    name: 'Canada',
    currencies: [{ code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }],
    flag: '🇨🇦',
  },
  {
    code: 'IE',
    name: 'Ireland',
    currencies: [{ code: 'EUR', symbol: '€', name: 'Euro' }],
    flag: '🇮🇪',
  },
];

export const DEFAULT_LOCATION: Country = SUPPORTED_LOCATIONS[0]; // Australia

export function getCountryByCode(code: string): Country | undefined {
  return SUPPORTED_LOCATIONS.find(country => country.code === code);
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.code,
    currencyDisplay: 'narrowSymbol',
  })
    .format(amount)
    .replace(currency.code, currency.symbol);
}