import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, Globe, Building2 } from 'lucide-react';
import { createBrand, updateBrand, deleteBrand, listBrands } from '../lib/db';
import type { Brand } from '../types';

const brandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters'),
  website: z.string().url('Must be a valid URL'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  headquarters: z.string().min(2, 'Headquarters location is required'),
  foundedYear: z.number().min(1800).max(new Date().getFullYear()),
  specialtiesText: z.string().min(1, 'At least one specialty is required'),
});

type BrandInputs = z.infer<typeof brandSchema>;

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BrandInputs>({
    resolver: zodResolver(brandSchema),
  });

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const loadedBrands = await listBrands();
        setBrands(loadedBrands);
      } catch (error) {
        console.error('Failed to load brands:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);

  const onSubmit = async (data: BrandInputs) => {
    try {
      const specialties = data.specialtiesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const brandData = {
        name: data.name,
        website: data.website,
        description: data.description,
        headquarters: data.headquarters,
        foundedYear: data.foundedYear,
        specialties,
      };

      if (editingId) {
        await updateBrand(editingId, brandData);
        const updatedBrands = brands.map(brand => 
          brand.id === editingId ? { ...brand, ...brandData } : brand
        );
        setBrands(updatedBrands);
        setEditingId(null);
      } else {
        const newBrand = await createBrand(brandData);
        setBrands([...brands, newBrand]);
      }
      
      reset();
    } catch (error) {
      console.error('Failed to save brand:', error);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setValue('name', brand.name);
    setValue('website', brand.website || '');
    setValue('description', brand.description);
    setValue('headquarters', brand.headquarters);
    setValue('foundedYear', brand.foundedYear);
    setValue('specialtiesText', brand.specialties.join('\n'));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand(id);
        setBrands(brands.filter(b => b.id !== id));
        if (editingId === id) {
          setEditingId(null);
          reset();
        }
      } catch (error) {
        console.error('Failed to delete brand:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading brands...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Brand Name
            </label>
            <input
              {...register('name')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter brand name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('website')}
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
            {errors.website && (
              <p className="text-red-400 text-sm mt-1">{errors.website.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter brand description"
          />
          {errors.description && (
            <p className="text-red-400 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Headquarters
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('headquarters')}
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="City, Country"
              />
            </div>
            {errors.headquarters && (
              <p className="text-red-400 text-sm mt-1">
                {errors.headquarters.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Founded Year
            </label>
            <input
              type="number"
              {...register('foundedYear', { valueAsNumber: true })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter founded year"
            />
            {errors.foundedYear && (
              <p className="text-red-400 text-sm mt-1">
                {errors.foundedYear.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Specialties (one per line)
          </label>
          <textarea
            {...register('specialtiesText')}
            rows={3}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter specialties (one per line)"
          />
          {errors.specialtiesText && (
            <p className="text-red-400 text-sm mt-1">
              {errors.specialtiesText.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          {editingId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                reset();
              }}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            {editingId !== null ? 'Update Brand' : 'Add Brand'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Brands</h3>
        <div className="grid grid-cols-1 gap-4">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-gray-700/50 rounded-lg p-4 flex items-start justify-between"
            >
              <div>
                <h4 className="text-lg font-medium text-white">{brand.name}</h4>
                <p className="text-gray-400 text-sm mt-1">{brand.description}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span>{brand.headquarters}</span>
                  <span>Founded: {brand.foundedYear}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {brand.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(brand)}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandManagement;