import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import api from '../lib/api';

interface Review {
  id: number;
  rating: number;
  comment: string;
  user: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export default function ReviewsDisplay() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchAverageRating();

    const handleReviewsUpdated = () => {
      fetchReviews();
      fetchAverageRating();
    };

    window.addEventListener('reviews:updated', handleReviewsUpdated);
    return () => window.removeEventListener('reviews:updated', handleReviewsUpdated);
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await api.get('/reviews?take=6');
      const payload = res.data?.reviews ?? res.data?.data?.reviews ?? res.data?.data ?? res.data;
      const reviewList = Array.isArray(payload) ? payload : [];
      setReviews(reviewList);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const res = await api.get('/reviews/stats/average');
      const average = res.data?.averageRating ?? res.data?.average ?? res.data?.data?.averageRating ?? res.data?.data?.average ?? 0;
      setAverageRating(Number(average) || 0);
    } catch (err) {
      console.error('Failed to fetch average rating:', err);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-mdg-lime text-mdg-lime' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mdg-blue mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Average Rating */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-mdg-navy mb-4">Customer Reviews</h2>
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={star <= Math.round(averageRating) ? 'fill-mdg-lime text-mdg-lime' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-2xl font-black text-mdg-navy">
              {averageRating.toFixed(1)} / 5.0
            </span>
          </div>
          <p className="text-mdg-slate text-sm mt-2">Based on {reviews.length} customer reviews</p>
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-mdg-blue transition-all"
              >
                {/* Stars */}
                <div className="mb-3">{renderStars(review.rating)}</div>

                {/* Comment */}
                <p className="text-mdg-slate text-sm mb-4 line-clamp-4">"{review.comment}"</p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-mdg-navy text-sm">
                      {review.user.firstName} {review.user.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-mdg-slate font-bold">No reviews yet. Be the first to share your experience!</p>
          </div>
        )}
      </div>
    </section>
  );
}
