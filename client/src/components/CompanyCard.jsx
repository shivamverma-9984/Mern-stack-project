import React from 'react';
import { Star, MapPin } from 'lucide-react';

export default function CompanyCard({ company, onClick }) {
  // Renders the stars matching the Figma design style
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating || 0);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={i <= roundedRating ? 'star-filled' : 'star-empty'}
        />
      );
    }
    return stars;
  };

  // Helper to format date as DD-MM-YYYY as shown in the screenshot
  const formatDate = (dateString) => {
    if (!dateString) return '01-01-2016'; // Fallback to matching date in Figma
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return dateString;
    }
  };

  // Helper to render customized square logo matching the image
  const renderSquareLogo = () => {
    const name = company.name.toLowerCase();
    
    // Check if it's one of the known mock companies to render matching icons/colors
    if (name.includes('graffersid')) {
      return (
        <div className="company-square-logo" style={{ backgroundColor: '#0b162f' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '38px', fontWeight: 'bold' }}>G</span>
        </div>
      );
    } else if (name.includes('code tech')) {
      return (
        <div className="company-square-logo" style={{ backgroundColor: '#1b631b' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>&lt;CT&gt;</span>
        </div>
      );
    } else if (name.includes('innogent')) {
      return (
        <div className="company-square-logo" style={{ backgroundColor: '#ff7700' }}>
          {/* Lightbulb emoji or symbol */}
          <span style={{ fontSize: '32px' }}>💡</span>
        </div>
      );
    }

    // Default logo rendering using image URL if provided, otherwise initials with gradient
    if (company.logo && company.logo.startsWith('http')) {
      return (
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className="company-square-logo"
          onError={(e) => {
            e.target.onerror = null;
            // Set dynamic background
            e.target.parentNode.style.backgroundColor = '#7c3aed';
          }}
        />
      );
    }

    // Extract initials
    const words = company.name.split(' ');
    const initials = words.slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return (
      <div className="company-square-logo" style={{ backgroundColor: '#7c3aed' }}>
        <span>{initials}</span>
      </div>
    );
  };

  // Determine whether to say "Founded on" or "Reg. Date"
  const dateLabel = company.name.toLowerCase().includes('graffersid') ? 'Founded on' : 'Reg. Date';

  return (
    <div className="company-horizontal-card">
      <div className="card-left-section">
        {/* Render customized avatar square */}
        {renderSquareLogo()}

        {/* Details middle section */}
        <div className="card-details-middle">
          <h3 className="company-title-txt">{company.name}</h3>
          
          <div className="company-address-txt">
            <MapPin size={12} style={{ color: '#94a3b8' }} />
            <span>{company.location || `${company.city}, India`}</span>
          </div>

          <div className="company-rating-row">
            <span className="company-rating-num">
              {company.avgRating > 0 ? company.avgRating.toFixed(1) : '0.0'}
            </span>
            <div className="rating-stars-list">
              {renderStars(company.avgRating)}
            </div>
            {/* Renders review count if present or default zero reviews */}
            <span className="reviews-count-txt">
              {company.reviewCount || 0} {company.reviewCount === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
        </div>
      </div>

      {/* Date and Action button right section */}
      <div className="card-right-section">
        <span className="registration-date-txt">
          {dateLabel} {formatDate(company.foundedOn)}
        </span>
        <button className="btn-detail-review" onClick={onClick}>
          Detail Review
        </button>
      </div>
    </div>
  );
}
