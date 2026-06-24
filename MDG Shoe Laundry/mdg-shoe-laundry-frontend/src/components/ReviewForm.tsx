import React, { useState } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import api from '../lib/api';
import { useNotification } from '../contexts/NotificationContext';

interface ReviewFormProps {
  orderId: number;
  onSubmitSuccess: () => void;
}

export default function ReviewForm({ orderId, onSubmitSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Comment must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post(`/reviews/order/${orderId}`, {
        rating,
        comment,
      });

      showNotification({
        title: 'Success',
        message: 'Thank you for your review!',
        type: 'success',
      });

      window.dispatchEvent(new Event('reviews:updated'));

      // Reset form
      setRating(0);
      setComment('');
      onSubmitSuccess();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to submit review';
      setError(errorMsg);
      showNotification({
        title: 'Error',
        message: errorMsg,
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-mdg-blue/10 rounded-2xl p-8 border border-mdg-blue/20">
      <h3 className="text-2xl font-black text-mdg-navy mb-6">Share Your Experience</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-bold text-mdg-navy mb-3 uppercase">Your Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={32}
                  className={
                    star <= (hoveredRating || rating)
                      ? 'fill-mdg-lime text-mdg-lime'
                      : 'text-gray-300'
                  }
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-xs text-mdg-slate mt-2">
              You selected {rating} {rating === 1 ? 'star' : 'stars'}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-bold text-mdg-navy mb-3 uppercase">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={submitting}
            placeholder="Share your experience with our service... (minimum 10 characters)"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-mdg-blue outline-none resize-none disabled:opacity-50"
            rows={4}
          />
          <p className="text-xs text-gray-400 mt-1">{comment.length} / 500</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full py-3 bg-mdg-navy text-white rounded-xl font-bold hover:bg-[rgb(8,22,40)] transition-all disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
