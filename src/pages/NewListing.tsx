import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import { listBags, listBrands, createListing } from '../lib/db';
import type { Bag, Brand } from '../types';

const listingSchema = z.object({
  bagId: z.string().min(1, 'Please select a bag'),
  pricingSchedule: z.object({
    minimumDays: z.number().min(1, 'Minimum rental duration must be at least 1 day'),
    dailyRate: z.number().min(1, 'Daily rate must be greater than 0'),
    weeklyRate: z.number().min(1, 'Weekly rate must be greater than 0'),
  }),
  deliveryOptions: z.object({
    pickup: z.boolean(),
    dropoff: z.boolean(),
    delivery: z.boolean(),
    deliveryFee: z.number().optional(),
    deliveryRadius: z.number().optional(),
    pickupLocation: z.string().optional(),
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type ListingInputs = z.infer<typeof listingSchema>;

const NewListing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [bags, setBags] = useState<Bag[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBag, setSelectedBag] = useState<Bag | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ListingInputs>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      pricingSchedule: {
        minimumDays: 1,
        dailyRate: 0,
        weeklyRate: 0,
      },
      deliveryOptions: {
        pickup: true,
        dropoff: false,
        delivery: false,
      },
    },
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

  const selectedBagId = watch('bagId');
  const deliveryEnabled = watch('deliveryOptions.delivery');
  const weeklyRate = watch('pricingSchedule.weeklyRate');
  const dailyRate = watch('pricingSchedule.dailyRate');

  useEffect(() => {
    if (selectedBagId) {
      const bag = bags.find(b => b.id === selectedBagId);
      setSelectedBag(bag || null);
    }
  }, [selectedBagId, bags]);

  const weeklySavings = dailyRate && weeklyRate 
    ? Math.round(((dailyRate * 7) - weeklyRate) / (dailyRate * 7) * 100)
    : 0;

  const onSubmit = async (data: ListingInputs) => {
    try {
      if (!user) {
        throw new Error('You must be logged in to create a listing');
      }

      if (!user.address) {
        throw new Error('You must set your address before creating a listing');
      }

      if (images.length === 0) {
        alert('Please upload at least one image');
        return;
      }

      if (!selectedBag) {
        alert('Please select a bag');
        return;
      }

      // Create listing with images
      const formData = new FormData();
      images.forEach((file) => {
        formData.append('images', file);
      });

      const listingData = {
        ...data,
        bagSpecs: selectedBag,
        owner: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
        },
        images: [], // Will be populated after image upload
        available: true,
        featured: false,
        rating: 0,
        reviews: 0,
        upvotes: 0,
      };

      const newListing = await createListing(listingData);
      navigate(`/listing/${newListing.id}`);
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert('Failed to create listing. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user?.address) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Location Required</h2>
          <p className="text-gray-400 mb-4">
            You need to set your address in your profile before creating a listing.
            This helps us connect you with nearby renters.
          </p>
          <Link
            to="/profile"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200 inline-flex items-center"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Set Address
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Listing Location</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-4">
              <div>
                <p className="text-gray-300">Your listing will be shown in:</p>
                <p className="text-white font-medium mt-1">
                  {user.address.city}, {user.address.state}
                </p>
              </div>
              <Link
                to="/profile"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Change
              </Link>
            </div>
            
            <div className="text-sm text-gray-400">
              <p className="flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Only your city and state will be visible to other users
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Images</h2>
          <ImageUpload
            images={images}
            onChange={setImages}
            maxImages={5}
            maxSize={5 * 1024 * 1024} // 5MB
          />
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Bag Selection</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Select Bag
              </label>
              <select
                {...register('bagId')}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a bag</option>
                {brands.map(brand => (
                  <optgroup key={brand.id} label={brand.name}>
                    {bags
                      .filter(bag => bag.brandId === brand.id)
                      .map(bag => (
                        <option key={bag.id} value={bag.id}>
                          {bag.model}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
              {errors.bagId && (
                <p className="text-red-400 text-sm mt-1">{errors.bagId.message}</p>
              )}
            </div>

            {selectedBag && (
              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Selected Bag Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>
                    <p>Protection Level: {selectedBag.protectionLevel}/5</p>
                    <p>TSA Compliant: {selectedBag.tsaCompliant}</p>
                  </div>
                  <div>
                    <p>Wheel Size: {selectedBag.wheelSize.min}" - {selectedBag.wheelSize.max}"</p>
                    <p>Weight: {selectedBag.weight.empty}g (empty)</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Minimum Days
              </label>
              <input
                type="number"
                min="1"
                {...register('pricingSchedule.minimumDays', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.pricingSchedule?.minimumDays && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.pricingSchedule.minimumDays.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Daily Rate ($)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                {...register('pricingSchedule.dailyRate', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.pricingSchedule?.dailyRate && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.pricingSchedule.dailyRate.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Weekly Rate ($)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                {...register('pricingSchedule.weeklyRate', { valueAsNumber: true })}
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />
              {errors.pricingSchedule?.weeklyRate && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.pricingSchedule.weeklyRate.message}
                </p>
              )}
              {weeklySavings > 0 && (
                <p className="text-green-400 text-sm mt-1">
                  {weeklySavings}% savings on weekly rentals
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Delivery Options</h2>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('deliveryOptions.pickup')}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">Pickup available</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('deliveryOptions.dropoff')}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">Drop-off available</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('deliveryOptions.delivery')}
                  className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-gray-300">Delivery available</span>
              </label>
            </div>

            {deliveryEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Delivery Fee ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('deliveryOptions.deliveryFee', { valueAsNumber: true })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Delivery Radius (km)
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register('deliveryOptions.deliveryRadius', { valueAsNumber: true })}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
          
          <div>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your listing, including any special instructions or requirements"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Link
            to="/dashboard"
            className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
          >
            Create Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewListing;