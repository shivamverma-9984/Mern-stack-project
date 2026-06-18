import express from 'express';
import { getReviews, addReview, likeReview } from '../config/db.js';

const router = express.Router();

// Get reviews for a specific company, with sorting
router.get('/company/:companyId', async (req, res) => {
  try {
    const { sortBy } = req.query; // 'newest', 'rating_desc', 'rating_asc', 'likes'
    const reviews = await getReviews(req.params.companyId, sortBy);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new review to a company
router.post('/company/:companyId', async (req, res) => {
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
});

// Like/Upvote a review
router.post('/:id/like', async (req, res) => {
  try {
    const review = await likeReview(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
