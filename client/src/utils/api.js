const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Fetch all companies, with optional search term, city filter, and average rating filter.
 */
export const fetchCompanies = async (search = '', city = '', rating = 0) => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (city) params.append('city', city);
  if (rating) params.append('rating', rating);

  const response = await fetch(`${API_BASE_URL}/companies?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  return response.json();
};

/**
 * Fetch detailed info for a single company by ID.
 */
export const fetchCompanyById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/companies/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch company details');
  }
  return response.json();
};

/**
 * Create a new company profile.
 */
export const createCompany = async (companyData) => {
  const response = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(companyData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create company');
  }
  return response.json();
};

/**
 * Fetch reviews for a company, sorted by sortBy options: 'newest', 'rating_desc', 'rating_asc', 'likes'.
 */
export const fetchReviews = async (companyId, sortBy = 'newest') => {
  const response = await fetch(`${API_BASE_URL}/reviews/company/${companyId}?sortBy=${sortBy}`);
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  return response.json();
};

/**
 * Create a new review for a company.
 */
export const createReview = async (companyId, reviewData) => {
  const response = await fetch(`${API_BASE_URL}/reviews/company/${companyId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to submit review');
  }
  return response.json();
};

/**
 * Increment the likes count for a specific review.
 */
export const likeReview = async (reviewId) => {
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/like`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to like review');
  }
  return response.json();
};

/**
 * Register a new user.
 */
export const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to sign up');
  }
  return response.json();
};

/**
 * Log in a user.
 */
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to log in');
  }
  return response.json();
};
