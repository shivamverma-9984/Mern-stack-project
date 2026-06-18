import express from 'express';
import { getCompanyReviews, createReview, likeCompanyReview } from '../controllers/review.controller.js';

const router = express.Router();

// Get reviews for a specific company, with sorting
router.get('/company/:companyId', getCompanyReviews);

// Add a new review to a company
router.post('/company/:companyId', createReview);

// Like/Upvote a review
router.post('/:id/like', likeCompanyReview);

export default router;
