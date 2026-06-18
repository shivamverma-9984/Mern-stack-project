import mongoose from 'mongoose';
import { getDbMode, readJsonDb, writeJsonDb } from '../config/db.js';

const reviewSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  fullName: { type: String, required: true },
  subject: { type: String, required: true },
  reviewText: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export const ReviewModel = mongoose.model('Review', reviewSchema);

// Get reviews for a company, sorted by parameter
export const getReviews = async (companyId, sortBy = 'newest') => {
  let reviews = [];
  if (getDbMode() === 'MongoDB') {
    reviews = await ReviewModel.find({ companyId }).lean();
  } else {
    const db = readJsonDb();
    reviews = db.reviews.filter(r => r.companyId === companyId);
  }

  // Sort reviews
  if (sortBy === 'newest') {
    reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy === 'rating_desc') {
    reviews.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'rating_asc') {
    reviews.sort((a, b) => a.rating - b.rating);
  } else if (sortBy === 'likes') {
    reviews.sort((a, b) => b.likes - a.likes);
  }

  return reviews;
};

// Add review
export const addReview = async (companyId, reviewData) => {
  if (getDbMode() === 'MongoDB') {
    const newReview = new ReviewModel({
      companyId,
      fullName: reviewData.fullName,
      subject: reviewData.subject,
      reviewText: reviewData.reviewText,
      rating: Number(reviewData.rating),
      likes: 0,
      createdAt: new Date()
    });
    const saved = await newReview.save();
    return saved.toObject();
  } else {
    const db = readJsonDb();
    const newReview = {
      _id: `rev_${Date.now()}`,
      companyId,
      fullName: reviewData.fullName,
      subject: reviewData.subject,
      reviewText: reviewData.reviewText,
      rating: Number(reviewData.rating),
      likes: 0,
      createdAt: new Date().toISOString()
    };
    db.reviews.push(newReview);
    writeJsonDb(db);
    return newReview;
  }
};

// Like a review
export const likeReview = async (reviewId) => {
  if (getDbMode() === 'MongoDB') {
    const updated = await ReviewModel.findByIdAndUpdate(
      reviewId,
      { $inc: { likes: 1 } },
      { new: true }
    ).lean();
    return updated;
  } else {
    const db = readJsonDb();
    const review = db.reviews.find(r => r._id === reviewId);
    if (!review) return null;
    review.likes = (review.likes || 0) + 1;
    writeJsonDb(db);
    return review;
  }
};
