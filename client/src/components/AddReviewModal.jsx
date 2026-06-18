import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { createReview } from '../utils/api';
import confetti from 'canvas-confetti';

const RATING_DESCRIPTIONS = {
  1: 'Terrible',
  2: 'Bad',
  3: 'Average',
  4: 'Good',
  5: 'Excellent'
};

export default function AddReviewModal({ isOpen, onClose, companyId, companyName, user, onReviewAdded, showToast }) {
  const [fullName, setFullName] = useState('');
  const [subject, setSubject] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Auto-fill full name if user is logged in
  React.useEffect(() => {
    if (isOpen) {
      if (user) {
        setFullName(user.fullName);
      } else {
        setFullName('');
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleStarMouseEnter = (value) => {
    setHoverRating(value);
  };

  const handleStarMouseLeave = () => {
    setHoverRating(0);
  };

  const validate = () => {
    if (rating === 0) return 'Please select a rating (1-5 stars)';
    if (!fullName.trim()) return 'Full name is required';
    if (!subject.trim()) return 'Review subject is required';
    if (!reviewText.trim()) return 'Review comment is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      showToast(error, 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const savedReview = await createReview(companyId, {
        fullName,
        subject,
        reviewText,
        rating
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      onReviewAdded(savedReview);
      showToast('Review posted successfully!', 'success');
      setIsSuccess(true);
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setFullName('');
    setSubject('');
    setReviewText('');
    setRating(0);
    setHoverRating(0);
    setIsSuccess(false);
    onClose();
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="modal-overlay">
      <div className="modal-content-card">
        
        {/* Modal Header */}
        <div className="modal-header-row">
          <h3>
            {isSuccess ? 'Success!' : `Write a Review for ${companyName}`}
          </h3>
          {!isSuccess && (
            <button className="close-modal-btn" onClick={handleResetAndClose}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="modal-body-panel">
          {isSuccess ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '15px', padding: '15px 0' }}>
              <CheckCircle2 size={48} style={{ color: 'var(--color-success)' }} />
              <div>
                <h4 style={{ fontSize: '16px', marginBottom: '6px', color: '#000000' }}>Review Submitted!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '280px' }}>
                  Your feedback has been published on <strong>{companyName}</strong>'s profile.
                </p>
              </div>
              <button className="btn-modal-submit" onClick={handleResetAndClose} style={{ width: '120px' }}>
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Star Selector */}
              <div className="form-field-group" style={{ marginBottom: '16px' }}>
                <label>Select Rating *</label>
                <div className="interactive-stars-container" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      className="interactive-star-btn"
                      onClick={() => handleStarClick(val)}
                      onMouseEnter={() => handleStarMouseEnter(val)}
                      onMouseLeave={handleStarMouseLeave}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                    >
                      <Star
                        size={24}
                        className={val <= activeRating ? 'star-filled' : 'star-empty'}
                        style={{ width: '24px', height: '24px' }}
                      />
                    </button>
                  ))}
                  {activeRating > 0 && (
                    <span className="rating-descriptor" style={{ fontSize: '12px', fontWeight: '600', color: '#e28743', marginLeft: '8px' }}>
                      {RATING_DESCRIPTIONS[activeRating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Full Name */}
              <div className="form-field-group">
                <label htmlFor="fullName">
                  Your Full Name * {user && <span style={{ color: 'var(--color-purple)', fontSize: '11px' }}>(Verified Account)</span>}
                </label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!!user}
                  required
                />
              </div>

              {/* Subject */}
              <div className="form-field-group">
                <label htmlFor="subject">Subject / Title *</label>
                <input
                  type="text"
                  id="subject"
                  placeholder="e.g. Highly recommend! Great work culture."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              {/* Review Text */}
              <div className="form-field-group">
                <label htmlFor="reviewText">Review Details *</label>
                <textarea
                  id="reviewText"
                  rows="4"
                  placeholder="Tell us about your experience working here, the work environment, management, or interview process..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                ></textarea>
              </div>

              <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '15px' }}>
                * By submitting, you confirm that all information is complete, honest, and accurate.
              </p>

              <div className="modal-footer-row" style={{ padding: '12px 0 0 0', borderTop: 'none' }}>
                <button type="button" className="btn-modal-cancel" onClick={handleResetAndClose} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
