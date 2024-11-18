import React, { createContext, useContext, useState } from 'react';

export interface Bag {
  id: number;
  model: string;
  protectionLevel: number;
  tsaCompliant: 'Yes' | 'No' | 'Unknown';
  wheelSize: {
    min: number;
    max: number;
  };
  weight: {
    empty: number;
    maxLoad: number;
  };
  bikeCompatibility: {
    mountainBike: boolean;
    roadBike: boolean;
    hybridBike: boolean;
    ebike: boolean;
  };
}

export interface Brand {
  id: number;
  name: string;
  website: string;
  description: string;
  logo?: string;
  headquarters: string;
  foundedYear: number;
  specialties: string[];
  bags: Bag[];
}

interface BrandContextType {
  brands: Brand[];
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  updateBrand: (id: number, brand: Omit<Brand, 'id'>) => void;
  deleteBrand: (id: number) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([
    {
      id: 1,
      name: 'EVOC',
      website: 'https://www.evocsports.com',
      description: 'German manufacturer specializing in sports bags and protection gear',
      headquarters: 'Munich, Germany',
      foundedYear: 2000,
      specialties: ['Bike Travel Bags', 'Protection Gear', 'Sports Backpacks'],
      bags: [
        {
          id: 1,
          model: 'BIKE TRAVEL PRO',
          protectionLevel: 5,
          tsaCompliant: 'Yes',
          wheelSize: { min: 26, max: 29 },
          weight: { empty: 8.6, maxLoad: 23 },
          bikeCompatibility: {
            mountainBike: true,
            roadBike: true,
            hybridBike: true,
            ebike: true,
          },
        },
      ],
    },
    {
      id: 2,
      name: 'Thule',
      website: 'https://www.thule.com',
      description: 'Swedish outdoor and transportation products company',
      headquarters: 'Malmö, Sweden',
      foundedYear: 1942,
      specialties: ['Bike Carriers', 'Roof Racks', 'Travel Cases'],
      bags: [
        {
          id: 2,
          model: 'ROUNDTRIP PRO XT',
          protectionLevel: 4,
          tsaCompliant: 'Yes',
          wheelSize: { min: 26, max: 29 },
          weight: { empty: 7.7, maxLoad: 22 },
          bikeCompatibility: {
            mountainBike: true,
            roadBike: true,
            hybridBike: true,
            ebike: false,
          },
        },
      ],
    },
  ]);

  const addBrand = (brand: Omit<Brand, 'id'>) => {
    const newBrand = {
      ...brand,
      id: Math.max(0, ...brands.map(b => b.id)) + 1,
    };
    setBrands([...brands, newBrand]);
  };

  const updateBrand = (id: number, brand: Omit<Brand, 'id'>) => {
    setBrands(brands.map(b => b.id === id ? { ...brand, id } : b));
  };

  const deleteBrand = (id: number) => {
    setBrands(brands.filter(b => b.id !== id));
  };

  return (
    <BrandContext.Provider value={{ brands, addBrand, updateBrand, deleteBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrands() {
  const context = useContext(BrandContext);
  if (context === undefined) {
    throw new Error('useBrands must be used within a BrandProvider');
  }
  return context;
}