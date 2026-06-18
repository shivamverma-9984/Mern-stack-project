import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCompanies, fetchCompanyById, createCompany } from '../../utils/api';

// Async Thunks
export const getCompaniesAsync = createAsyncThunk(
  'company/getCompanies',
  async ({ search, city } = {}, { rejectWithValue }) => {
    try {
      const data = await fetchCompanies(search, city);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCompanyByIdAsync = createAsyncThunk(
  'company/getCompanyById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchCompanyById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCompanyAsync = createAsyncThunk(
  'company/addCompany',
  async (companyData, { rejectWithValue }) => {
    try {
      const data = await createCompany(companyData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  companies: [],
  currentCompany: null,
  activeCompanyId: null,
  status: 'idle',
  error: null,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    setActiveCompanyId: (state, action) => {
      state.activeCompanyId = action.payload;
    },
    clearCurrentCompany: (state) => {
      state.currentCompany = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCompanies
      .addCase(getCompaniesAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCompaniesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies = action.payload;
      })
      .addCase(getCompaniesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // getCompanyById
      .addCase(getCompanyByIdAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getCompanyByIdAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCompany = action.payload;
      })
      .addCase(getCompanyByIdAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // addCompany
      .addCase(addCompanyAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addCompanyAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.companies.push(action.payload);
      })
      .addCase(addCompanyAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setActiveCompanyId, clearCurrentCompany } = companySlice.actions;
export default companySlice.reducer;
