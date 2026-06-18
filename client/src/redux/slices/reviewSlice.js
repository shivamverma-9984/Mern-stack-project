import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchReviews, createReview, likeReview } from '../../utils/api';

// Async Thunks
export const getReviewsAsync = createAsyncThunk(
  'review/getReviews',
  async ({ companyId, sortBy }, { rejectWithValue }) => {
    try {
      const data = await fetchReviews(companyId, sortBy);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addReviewAsync = createAsyncThunk(
  'review/addReview',
  async ({ companyId, reviewData }, { rejectWithValue }) => {
    try {
      const data = await createReview(companyId, reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeReviewAsync = createAsyncThunk(
  'review/likeReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const data = await likeReview(reviewId);
      return data; // returns the updated review object
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  reviews: [],
  status: 'idle',
  error: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getReviews
      .addCase(getReviewsAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getReviewsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(getReviewsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // addReview
      .addCase(addReviewAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addReviewAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews.unshift(action.payload);
      })
      .addCase(addReviewAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // likeReview
      .addCase(likeReviewAsync.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;
