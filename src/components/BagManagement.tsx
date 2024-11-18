import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, Bike, Scale, Ruler, Link } from 'lucide-react';
import { createBag, updateBag, deleteBag, listBags } from '../lib/db';
import { listBrands } from '../lib/db';
import type { Bag, Brand } from '../types';

const bagSchema = z.object({
  brandId: z.string().min(1, 'Brand is required'),
  model: z.string().min(2, 'Model is required'),
  protectionLevel: z.number().min(1).max(5),
  transportRating: z.number().min(1).max(5),
  wheelSize: z.object({
    min: z.number().min(20).max(29),
    max: z.number().min(20).max(29),
  }),
  weight: z.object({
    empty: z.number().min(0),
    maxLoad: z.number().min(0),
  }),
  dimensions: z.object({
    length: z.number().min(0),
    width: z.number().min(0),
    height: z.number().min(0),
  }),
  volume: z.number().min(0, 'Volume must be positive'),
  tsaCompliant: z.enum(['Yes', 'No', 'Unknown']),
  manualUrl: z.string().url().optional().or(z.literal('')),
  packingGuideUrl: z.string().url().optional().or(z.literal('')),
  compatibility: z.array(z.string()),
});

type BagInputs = z.infer<typeof bagSchema>;

const defaultBagValues: BagInputs = {
  brandId: '',
  model: '',
  protectionLevel: 3,
  transportRating: 3,
  wheelSize: {
    min: 26,
    max: 29,
  },
  weight: {
    empty: 0,
    maxLoad: 0,
  },
  dimensions: {
    length: 0,
    width: 0,
    height: 0,
  },
  volume: 0,
  tsaCompliant: 'Unknown',
  manualUrl: '',
  packingGuideUrl: '',
  compatibility: [],
};

const BagManagement: React.FC = () => {
  const [bags, setBags] = useState<Bag[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BagInputs>({
    resolver: zodResolver(bagSchema),
    defaultValues: defaultBagValues,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedBags, loadedBrands] = await Promise.all([
          listBags(),
          listBrands(),
        ]);
        setBags(loadedBags);
        setBrands(loadedBrands);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const onSubmit = async (data: BagInputs) => {
    try {
      if (editingId) {
        await updateBag(editingId, data);
        const updatedBags = bags.map(bag => 
          bag.id === editingId ? { ...bag, ...data } : bag
        );
        setBags(updatedBags);
        setEditingId(null);
      } else {
        const newBag = await createBag(data);
        setBags([...bags, newBag]);
      }
      
      reset(defaultBagValues);
    } catch (error) {
      console.error('Failed to save bag:', error);
    }
  };

  const handleEdit = (bag: Bag) => {
    setEditingId(bag.id);
    setValue('brandId', bag.brandId);
    setValue('model', bag.model);
    setValue('protectionLevel', bag.protectionLevel);
    setValue('transportRating', bag.transportRating);
    setValue('wheelSize', bag.wheelSize);
    setValue('weight', bag.weight);
    setValue('dimensions', bag.dimensions);
    setValue('volume', bag.volume);
    setValue('tsaCompliant', bag.tsaCompliant);
    setValue('manualUrl', bag.manualUrl || '');
    setValue('packingGuideUrl', bag.packingGuideUrl || '');
    setValue('compatibility', bag.compatibility);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this bag?')) {
      try {
        await deleteBag(id);
        setBags(bags.filter(b => b.id !== id));
        if (editingId === id) {
          setEditingId(null);
          reset(defaultBagValues);
        }
      } catch (error) {
        console.error('Failed to delete bag:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading bags...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Brand
            </label>
            <select
              {...register('brandId')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
            {errors.brandId && (
              <p className="text-red-400 text-sm mt-1">{errors.brandId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Model
            </label>
            <input
              {...register('model')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter model name"
            />
            {errors.model && (
              <p className="text-red-400 text-sm mt-1">{errors.model.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Protection Level (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              {...register('protectionLevel', { valueAsNumber: true })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.protectionLevel && (
              <p className="text-red-400 text-sm mt-1">
                {errors.protectionLevel.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Transport Rating (1-5)
            </label>
            <input
              type="number"
              min="1"
              max="5"
              {...register('transportRating', { valueAsNumber: true })}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
            {errors.transportRating && (
              <p className="text-red-400 text-sm mt-1">
                {errors.transportRating.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              TSA Compliant
            </label>
            <select
              {...register('tsaCompliant')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Wheel Size Range (inches)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                min="20"
                max="29"
                step="0.5"
                {...register('wheelSize.min', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              {errors.wheelSize?.min && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.wheelSize.min.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                min="20"
                max="29"
                step="0.5"
                {...register('wheelSize.max', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
              {errors.wheelSize?.max && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.wheelSize.max.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Weight (grams)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                min="0"
                {...register('weight.empty', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Empty weight"
              />
              {errors.weight?.empty && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.weight.empty.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                min="0"
                {...register('weight.maxLoad', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Max load"
              />
              {errors.weight?.maxLoad && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.weight.maxLoad.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Dimensions (cm)
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                min="0"
                {...register('dimensions.length', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Length"
              />
              {errors.dimensions?.length && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.dimensions.length.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                min="0"
                {...register('dimensions.width', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Width"
              />
              {errors.dimensions?.width && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.dimensions.width.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="number"
                min="0"
                {...register('dimensions.height', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="Height"
              />
              {errors.dimensions?.height && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.dimensions.height.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Volume (L)
          </label>
          <input
            type="number"
            min="0"
            step="0.1"
            {...register('volume', { valueAsNumber: true })}
            className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            placeholder="Bag volume in liters"
          />
          {errors.volume && (
            <p className="text-red-400 text-sm mt-1">{errors.volume.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Manual URL
            </label>
            <input
              type="url"
              {...register('manualUrl')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/manual.pdf"
            />
            {errors.manualUrl && (
              <p className="text-red-400 text-sm mt-1">{errors.manualUrl.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Packing Guide URL
            </label>
            <input
              type="url"
              {...register('packingGuideUrl')}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/packing-guide.pdf"
            />
            {errors.packingGuideUrl && (
              <p className="text-red-400 text-sm mt-1">{errors.packingGuideUrl.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bike Compatibility
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['mountainBike', 'roadBike', 'hybridBike', 'ebike'].map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 text-gray-300"
              >
                <input
                  type="checkbox"
                  {...register('compatibility')}
                  value={type}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {editingId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                reset(defaultBagValues);
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
            {editingId !== null ? 'Update Bag' : 'Add Bag'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Existing Bags</h3>
        <div className="grid grid-cols-1 gap-4">
          {bags.map((bag) => (
            <div
              key={bag.id}
              className="bg-gray-700/50 rounded-lg p-4 flex items-start justify-between"
            >
              <div>
                <h4 className="text-lg font-medium text-white">
                  {brands.find(b => b.id === bag.brandId)?.name} {bag.model}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {bag.compatibility.map((type) => (
                    <span
                      key={type}
                      className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-sm flex items-center"
                    >
                      <Bike className="w-4 h-4 mr-1" />
                      <span className="capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                    </span>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  <p>Volume: {bag.volume}L</p>
                  <p>
                    Wheel Size: {bag.wheelSize.min}" - {bag.wheelSize.max}"
                  </p>
                  <p>Protection Level: {bag.protectionLevel}/5</p>
                  <p>
                    Weight: {bag.weight.empty}g (empty), {bag.weight.maxLoad}g
                    (max load)
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(bag)}
                  className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(bag.id)}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {bags.length === 0 && (
            <div className="text-center py-12 bg-gray-700/50 rounded-lg">
              <Scale className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No bags added yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BagManagement;