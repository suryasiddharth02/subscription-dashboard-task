import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMySubscription = createAsyncThunk('subscription/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/subscriptions/my-subscription');
    return res.data.subscription;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const changeSubscription = createAsyncThunk('subscription/change', async (planId, { rejectWithValue }) => {
  try {
    const res = await api.post(`/subscriptions/change/${planId}`);
    return res.data.subscription;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

const initialState = {
  plans: [],
  currentSubscription: null,
  isLoading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setPlans(state, action) {
      state.plans = action.payload;
    },
    setCurrentSubscription(state, action) {
      state.currentSubscription = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMySubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMySubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(fetchMySubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(changeSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeSubscription.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(changeSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setPlans,
  setCurrentSubscription,
  setLoading,
  setError,
  clearError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
