import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import paymentService from "./paymentService";

const initialState = {
  payments: [],
  razorpayKey: null,
  currentOrder: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Get Razorpay Key
export const getRazorpayKey = createAsyncThunk(
  "payment/getKey",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentService.getRazorpayKey(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Order
export const createPaymentOrder = createAsyncThunk(
  "payment/createOrder",
  async (orderData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentService.createOrder(orderData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Verify Payment
export const verifyPayment = createAsyncThunk(
  "payment/verify",
  async (paymentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentService.verifyPayment(paymentData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get My Payments
export const getMyPayments = createAsyncThunk(
  "payment/getMyPayments",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await paymentService.getMyPayments(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Key
      .addCase(getRazorpayKey.fulfilled, (state, action) => {
        state.razorpayKey = action.payload;
      })
      // Create Order
      .addCase(createPaymentOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload; // Contains order_id, amount, etc.
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Verify Payment
      .addCase(verifyPayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Payment successful!";
        // Optionally add to payments list or refresh
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get My Payments
      .addCase(getMyPayments.fulfilled, (state, action) => {
        state.payments = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
