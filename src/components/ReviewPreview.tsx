import React, { useState, useEffect } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Review } from '../types';

interface ReviewPreviewProps {
  listingId: number;
  limit?: number;
}

const ReviewPreview: React.FC<ReviewPreviewProps> = ({ listingId, limit = 2 }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/listing/${listingId}?limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [listingId, limit]);

  if (isLoading) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-600 rounded w-24"></div>
                <div className="h-4 bg-gray-600 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-600 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
        <p className="text-gray-400">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-700/50 rounded-lg p-4 space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-white">{review.userName}</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating ? 'text-yellow-500' : 'text-gray-600'
                    }`}
                    fill={i < review.rating ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
            </div>
            <span className="text-sm text-gray-400">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
          {review.comment && (
            <p className="text-gray-300 text-sm">{review.comment}</p>
          )}
        </div>
      ))}
      
      <Link
        to={`/listing/${listingId}`}
        className="flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors pt-2 border-t border-gray-600"
      >
        <span>View all reviews</span>
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  );
};

export default ReviewPreview;