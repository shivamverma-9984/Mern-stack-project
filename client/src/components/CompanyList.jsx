import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { fetchCompanies } from '../utils/api';
import CompanyCard from './CompanyCard';

export default function CompanyList({
  onCompanyClick,
  refreshTrigger,
  searchTerm,
  setSearchTerm,
  onAddCompanyClick,
  showToast
}) {
  const [companies, setCompanies] = useState([]);
  const [cityInput, setCityInput] = useState('Indore, Madhya Pradesh, India');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('name'); // Default sort by Name as in Figma screenshot
  const [isLoading, setIsLoading] = useState(true);

  // Load companies based on active filters and sort criteria
  useEffect(() => {
    const loadFilteredCompanies = async () => {
      setIsLoading(true);
      try {
        // We call fetchCompanies with searchTerm and the resolved city filter
        const data = await fetchCompanies(searchTerm, cityFilter);
        
        // Handle sorting options
        let sortedData = [...data];
        if (sortBy === 'name') {
          sortedData.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'rating') {
          sortedData.sort((a, b) => b.avgRating - a.avgRating);
        } else if (sortBy === 'location') {
          sortedData.sort((a, b) => a.city.localeCompare(b.city));
        }
        
        setCompanies(sortedData);
      } catch (err) {
        showToast('Failed to load companies list', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      loadFilteredCompanies();
    }, 200);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, cityFilter, sortBy, refreshTrigger]);

  // When clicking "Find Company", we resolve the city filter from input
  const handleFindCompany = () => {
    // If user enters an address, extract the city name (e.g. "Indore, Madhya Pradesh" -> "Indore")
    const extractedCity = cityInput.split(',')[0].trim();
    setCityFilter(extractedCity);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFindCompany();
    }
  };

  return (
    <div>
      {/* Sub-header Filter Bar from Figma */}
      <div className="filters-panel">
        
        {/* City Filter */}
        <div className="filter-group">
          <span className="filter-label">Select City</span>
          <div className="city-input-wrapper">
            <input
              type="text"
              className="city-input"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter City..."
            />
            <MapPin size={16} className="city-input-icon" />
          </div>
        </div>

        {/* Find Company Button */}
        <button className="btn-purple" onClick={handleFindCompany}>
          Find Company
        </button>

        {/* Add Company Button */}
        <button className="btn-purple-add" onClick={onAddCompanyClick}>
          + Add Company
        </button>

        {/* Sort Selector */}
        <div className="filter-group" style={{ marginLeft: 'auto' }}>
          <span className="filter-label">Sort:</span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="location">Location</option>
          </select>
        </div>
      </div>

      {/* Thin Horizontal Divider Line */}
      <hr className="filters-divider" />

      {/* Results Count */}
      {!isLoading && (
        <div className="results-count-lbl">
          Result Found: {companies.length}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <div className="review-count-pill" style={{ padding: '10px 20px', fontSize: '14px', background: '#f1f3f7', color: '#666666' }}>
            Loading companies...
          </div>
        </div>
      ) : companies.length > 0 ? (
        /* Companies Horizontal List */
        <div className="companies-list-wrapper">
          {companies.map((company) => (
            <CompanyCard
              key={company._id}
              company={company}
              onClick={() => onCompanyClick(company._id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="empty-state-card">
          <h3>No Companies Found</h3>
          <p>We couldn't find any companies matching your search criteria. Try modifying the city or name filters.</p>
        </div>
      )}
    </div>
  );
}
