import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import companyReducer from './slices/companySlice';
import reviewReducer from './slices/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    company: companyReducer,
    review: reviewReducer,
  },
});
