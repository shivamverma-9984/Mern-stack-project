import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signupUser, loginUser } from '../../utils/api';

// Async Thunks
export const signupAsync = createAsyncThunk(
  'auth/signup',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await signupUser(userData);
      return data; // returns { token, user }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials);
      return data; // returns { token, user }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const getInitialUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (e) {
    return null;
  }
};

const getInitialToken = () => {
  return localStorage.getItem('token') || null;
};

const initialState = {
  user: getInitialUser(),
  token: getInitialToken(),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
