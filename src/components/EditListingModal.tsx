import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, MapPin, DollarSign, Truck } from 'lucide-react';
import { useBrands } from '../context/BrandContext';
import type { Listing, Bag } from '../types';
import ImageUpload from './ImageUpload';
import { usePrice } from '../utils/currency';

const listingSchema = z.object({
  bagId: z.string().min(1, 'Bag model is required'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
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
});

type ListingInputs = z.infer<typeof listingSchema>;

interface EditListingModalProps {
  listing: Listing;
  onClose: () => void;
  onSave: (updatedListing: Listing) => void;
}

const EditListingModal: React.FC<EditListingModalProps> = ({ listing, onClose, onSave }) => {
  const { brands } = useBrands();
  const [images, setImages] = useState<File[]>([]);
  const [selectedBag, setSelectedBag] = useState<Bag | null>(null);
  const { format: formatPrice } = usePrice();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ListingInputs>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      bagId: listing.bagSpecs.id?.toString(),
      location: listing.location,
      description: listing.description,
      pricingSchedule: listing.pricingSchedule,
      deliveryOptions: listing.deliveryOptions,
    },
  });

  const selectedBagId = watch('bagId');
  const deliveryEnabled = watch('deliveryOptions.delivery');
  const weeklyRate = watch('pricingSchedule.weeklyRate');
  const dailyRate = watch('pricingSchedule.dailyRate');

  // Calculate savings percentage for weekly rate
  const weeklySavings = dailyRate && weeklyRate 
    ? Math.round(((dailyRate * 7) - weeklyRate) / (dailyRate * 7) * 100)
    : 0;

  useEffect(() => {
    if (selectedBagId) {
      const bag = brands
        .flatMap(brand => brand.bags)
        .find(bag => bag.id.toString() === selectedBagId);
      setSelectedBag(bag || null);
    }
  }, [selectedBagId, brands]);

  const onSubmit = async (data: ListingInputs) => {
    try {
      if (!selectedBag) {
        alert('Please select a bag');
        return;
      }

      const updatedListing: Listing = {
        ...listing,
        bagSpecs: selectedBag,
        location: data.location,
        description: data.description,
        pricingSchedule: data.pricingSchedule,
        deliveryOptions: data.deliveryOptions,
        updatedAt: new Date(),
      };

      // If new images were uploaded, handle them
      if (images.length > 0) {
        // TODO: Handle image upload and update listing.images
        console.log('New images to upload:', images);
      }

      onSave(updatedListing);
      onClose();
    } catch (error) {
      console.error('Failed to update listing:', error);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-gray-800 rounded-xl p-8 shadow-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-6">
              Edit Listing
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Images
                </label>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {listing.images.map((image, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-700">
                      <img
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload New Images (Optional)
                </label>
                <ImageUpload
                  images={images}
                  onChange={setImages}
                  maxImages={5}
                  maxSize={5 * 1024 * 1024} // 5MB
                />
              </div>

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
                      {brand.bags?.map(bag => (
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
                      <p>Weight: {selectedBag.weight.empty}kg (empty)</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium text-gray-300 mb-1">Compatible with:</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(selectedBag.bikeCompatibility)
                          .filter(([_, compatible]) => compatible)
                          .map(([type]) => (
                            <span
                              key={type}
                              className="bg-gray-600 text-gray-200 px-2 py-1 rounded text-sm"
                            >
                              {type.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('location')}
                    className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your location"
                  />
                </div>
                {errors.location && (
                  <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
                )}
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Pricing Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Daily Rate
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        min="1"
                        {...register('pricingSchedule.dailyRate', { valueAsNumber: true })}
                        className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Weekly Rate
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        min="1"
                        {...register('pricingSchedule.weeklyRate', { valueAsNumber: true })}
                        className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    {weeklySavings > 0 && (
                      <p className="text-green-400 text-sm mt-1">
                        {weeklySavings}% savings on weekly rentals
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white mb-4">Delivery Options</h3>
                <div className="space-y-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Delivery Fee
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="number"
                            min="0"
                            {...register('deliveryOptions.deliveryFee', { valueAsNumber: true })}
                            className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter delivery fee"
                          />
                        </div>
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
                          placeholder="Maximum delivery distance"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
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

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditListingModal;