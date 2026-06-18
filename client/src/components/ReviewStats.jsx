import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewStats({ reviews, avgRating }) {
  const totalReviews = reviews.length;

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    const rating = Math.round(review.rating);
    if (counts[rating] !== undefined) {
      counts[rating]++;
    }
  });

  const renderStars = (rating, size = 16) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={size}
          className={`star-icon ${i <= roundedRating ? 'star-filled' : 'star-empty'}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        />
      );
    }
    return stars;
  };

  return (
    <div className="stats-card-white">
      <h3>Rating Summary</h3>
      
      <div className="average-score-row">
        <div className="average-score-large">
          {avgRating > 0 ? avgRating.toFixed(1) : '0.0'}
        </div>
        <div className="average-stars-group">
          <div className="rating-stars-list" style={{ gap: '2px' }}>
            {renderStars(avgRating, 16)}
          </div>
          <span className="average-stars-count">
            Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </span>
        </div>
      </div>

      <div className="rating-distribution-chart" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[5, 4, 3, 2, 1].map(stars => {
          const count = counts[stars];
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
          return (
            <div key={stars} className="breakdown-row">
              <div className="breakdown-label">
                <span>{stars}</span>
                <Star size={11} className="star-filled" style={{ width: '11px', height: '11px' }} />
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="breakdown-count">{count}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
