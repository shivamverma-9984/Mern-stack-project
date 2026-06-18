import { getReviews, addReview, likeReview } from '../models/review.model.js';

// Get reviews for a specific company, with sorting
export const getCompanyReviews = async (req, res) => {
  try {
    const { sortBy } = req.query; // 'newest', 'rating_desc', 'rating_asc', 'likes'
    const reviews = await getReviews(req.params.companyId, sortBy);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new review to a company
export const createReview = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { fullName, subject, reviewText, rating } = req.body;
    
    if (!fullName || !subject || !reviewText || rating === undefined) {
      return res.status(400).json({ error: "Missing required fields (fullName, subject, reviewText, rating)" });
    }
    
    const review = await addReview(companyId, { fullName, subject, reviewText, rating });
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like/Upvote a review
export const likeCompanyReview = async (req, res) => {
  try {
    const review = await likeReview(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
