import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ThumbsUp, Share2, Star } from 'lucide-react';
import { likeReviewAsync } from '../redux/slices/reviewSlice';

export default function ReviewCard({ review, showToast }) {
  const dispatch = useDispatch();
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    setIsLiking(true);
    try {
      await dispatch(likeReviewAsync(review._id)).unwrap();
      setHasLiked(true);
      showToast('Liked review successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to like review.', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = () => {
    try {
      const shareUrl = `${window.location.origin}/company/${review.companyId}#review-${review._id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast('Review link copied to clipboard!', 'info');
      }).catch(() => {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        showToast('Review link copied to clipboard!', 'info');
      });
    } catch (e) {
      showToast('Could not copy link.', 'error');
    }
  };

  return (
    <div className="review-item-card" id={`review-${review._id}`}>
      <div className="review-item-header">
        <div className="reviewer-profile">
          <div className="reviewer-circle">
            {getInitials(review.fullName)}
          </div>
          <div className="reviewer-name-col">
            <span className="reviewer-name-lbl">{review.fullName}</span>
            <span className="reviewer-date-lbl">{formatDate(review.createdAt)}</span>
          </div>
        </div>

        <div className="review-item-rating">
          <span>{review.rating.toFixed(1)}</span>
          <Star size={11} className="star-filled" style={{ fill: '#e28743', color: '#e28743' }} />
        </div>
      </div>

      <div>
        <h4 className="review-item-subject">{review.subject}</h4>
        <p className="review-item-text" style={{ marginTop: '6px' }}>{review.reviewText}</p>
      </div>

      <div className="review-item-actions">
        <button
          className="btn-review-action"
          onClick={handleLike}
          disabled={hasLiked || isLiking}
          style={{ color: hasLiked ? 'var(--color-purple)' : 'inherit' }}
        >
          <ThumbsUp size={14} style={{ fill: hasLiked ? 'var(--color-purple)' : 'none' }} />
          <span>Helpful ({review.likes || 0})</span>
        </button>

        <button className="btn-review-action" onClick={handleShare}>
          <Share2 size={14} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
