import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Plus, Calendar, MapPin, Inbox, SortAsc } from 'lucide-react';
import { getCompanyByIdAsync, clearCurrentCompany } from '../redux/slices/companySlice';
import { getReviewsAsync, clearReviews } from '../redux/slices/reviewSlice';
import ReviewStats from './ReviewStats';
import ReviewCard from './ReviewCard';
import AddReviewModal from './AddReviewModal';

export default function CompanyDetails({ companyId, onBack, showToast }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const company = useSelector(state => state.company.currentCompany);
  const reviews = useSelector(state => state.review.reviews);
  const companyStatus = useSelector(state => state.company.status);
  const reviewStatus = useSelector(state => state.review.status);

  const [sortBy, setSortBy] = useState('newest');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const isLoading = companyStatus === 'loading' || reviewStatus === 'loading';

  // Load Company and Reviews
  useEffect(() => {
    dispatch(getCompanyByIdAsync(companyId));
    dispatch(getReviewsAsync({ companyId, sortBy }));

    return () => {
      // Clear data on unmount
      dispatch(clearCurrentCompany());
      dispatch(clearReviews());
    };
  }, [dispatch, companyId, sortBy]);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading && !company) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
        <div className="review-count-pill" style={{ padding: '10px 20px', fontSize: '14px', background: '#f1f3f7', color: '#666666' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div>
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={14} /> Back to listing
        </button>
        <div className="empty-state-card">
          <h3>Company Not Found</h3>
          <p>The company profile you are trying to view does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button className="back-link" onClick={onBack}>
        <ArrowLeft size={14} /> Back to listing
      </button>

      {/* Hero Header Card */}
      <div className="company-detail-header">
        <div className="detail-header-left">
          {/* Custom logo square loader fallback */}
          {company.logo && company.logo.startsWith('http') ? (
            <img
              src={company.logo}
              alt={company.name}
              className="detail-logo-large"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&q=80";
              }}
            />
          ) : (
            <div className="detail-logo-large" style={{ backgroundColor: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '24px', fontWeight: 'bold' }}>
              {company.name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
            </div>
          )}
          
          <div className="detail-title">
            <h2>{company.name}</h2>
            <div className="detail-meta-row">
              <div className="detail-meta-item">
                <MapPin size={14} />
                <span>{company.location || `${company.city}, India`}</span>
              </div>
              <div className="detail-meta-item">
                <Calendar size={14} />
                <span>Founded {formatDate(company.foundedOn)}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn-add-review" onClick={() => setIsReviewModalOpen(true)}>
          <Plus size={16} /> Add Review
        </button>
      </div>

      {/* Reviews Content Grid */}
      <div className="reviews-grid-layout">
        
        {/* Left Column: Stats */}
        <ReviewStats reviews={reviews} avgRating={company.avgRating} />

        {/* Right Column: Reviews list & Sorting */}
        <div className="reviews-list-area">
          
          <div className="reviews-list-header">
            <h3>Reviews ({reviews.length})</h3>
            
            {reviews.length > 0 && (
              <div className="sort-reviews-wrapper">
                <SortAsc size={14} />
                <span>Sort by:</span>
                <select
                  className="sort-reviews-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="likes">Most Helpful</option>
                  <option value="rating_desc">Highest Rating</option>
                  <option value="rating_asc">Lowest Rating</option>
                </select>
              </div>
            )}
          </div>

          {/* Review Cards List */}
          {reviews.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  showToast={showToast}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <Inbox size={32} style={{ color: '#94a3b8', marginBottom: '8px' }} />
              <h3>No reviews yet</h3>
              <p>Be the first to share your experience working at {company.name}!</p>
              <button
                className="btn-add-review"
                onClick={() => setIsReviewModalOpen(true)}
                style={{ marginTop: '10px' }}
              >
                <Plus size={16} /> Write a Review
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Write Review Modal */}
      <AddReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        companyId={company._id}
        companyName={company.name}
        showToast={showToast}
        sortBy={sortBy}
      />
    </div>
  );
}
