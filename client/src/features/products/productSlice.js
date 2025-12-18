import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productService from "./productService";

const productSlice = createSlice({
  name: "products",
  initialState: {
    allProducts: [],
    page: 1,
    pages: 1,
    total: 0,
    product: {},
    productLoading: false,
    productSuccess: false,
    productError: false,
    productErrorMessage: "",
    edit: {
      product: {},
      isEdit: false,
    },
  },
  reducers: {
    editProduct: (state, action) => {
      return {
        ...state,
        edit: { product: action.payload, isEdit: true },
      };
    },
    resetProductState: (state) => {
      state.productLoading = false;
      state.productSuccess = false;
      state.productError = false;
      state.productErrorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.productLoading = true;
        state.productSuccess = false;
        state.productError = false;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.productLoading = false;
        state.allProducts = action.payload.listings;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
        state.productSuccess = true;
        state.productError = false;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.productLoading = false;
        state.productSuccess = false;
        state.productError = true;
        state.productErrorMessage = action.payload;
      })
      .addCase(getProduct.pending, (state, action) => {
        state.productLoading = true;
        state.productSuccess = false;
        state.productError = false;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.product = action.payload;
        state.productSuccess = true;
        state.productError = false;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productSuccess = false;
        state.productError = true;
        state.productErrorMessage = action.payload;
      })
      .addCase(updateProduct.pending, (state, action) => {
        state.productLoading = true;
        state.productSuccess = false;
        state.productError = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.allProducts = state.allProducts.map((product) =>
          product._id === action.payload._id ? action.payload : product
        );
        state.edit = { product: {}, isEdit: false };
        state.productSuccess = true;
        state.productError = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productSuccess = false;
        state.productError = true;
        state.productErrorMessage = action.payload;
      })
      .addCase(addProduct.pending, (state, action) => {
        state.productLoading = true;
        state.productSuccess = false;
        state.productError = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.allProducts = [action.payload, ...state.allProducts];
        state.productSuccess = true;
        state.productError = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productSuccess = false;
        state.productError = true;
        state.productErrorMessage = action.payload;
      })
      .addCase(deleteProduct.pending, (state, action) => {
        state.productLoading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.allProducts = state.allProducts.filter(
          (product) => product._id !== action.payload.id
        );
        state.productSuccess = true;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = true;
        state.productErrorMessage = action.payload;
      })
      // Approve
      .addCase(approveProduct.fulfilled, (state, action) => {
        state.allProducts = state.allProducts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      // Reject
      .addCase(rejectProduct.fulfilled, (state, action) => {
        state.allProducts = state.allProducts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      // Mark Sold
      .addCase(markSoldProduct.fulfilled, (state, action) => {
        state.allProducts = state.allProducts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      });
  },
});

export const { editProduct, resetProductState } = productSlice.actions;
export default productSlice.reducer;

// Fetch Products
export const getProducts = createAsyncThunk(
  "FETCH/PRODUCTS",
  async (params, thunkAPI) => {
    try {
      return await productService.fetchProducts(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch Product
export const getProduct = createAsyncThunk(
  "FETCH/PRODUCT",
  async (id, thunkAPI) => {
    try {
      return await productService.fetchProduct(id);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Product
export const updateProduct = createAsyncThunk(
  "UPDATE/PRODUCT",
  async (payload, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;

    let id, data;
    if (payload instanceof FormData) {
      // If it's FormData, we can't check ._id directly.
      // We should expect the caller to pass { id, data } if using FormData.
      // But wait, if I change the caller to always pass { id, data }, it's safer.
      // However, to support legacy calls (if any), I need to be careful.
      // But I am the one changing the caller in MyProfile.jsx.
      // Are there other callers?
      // I'll assume payload has id and data if it's the new format.
      // If payload has _id, it's the old format (plain object).
      id = payload.id;
      data = payload.data;
    } else if (payload._id) {
      id = payload._id;
      data = payload;
    } else {
      // Fallback or error
      id = payload.id;
      data = payload.data;
    }

    try {
      return await productService.update(id, data, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add Product
export const addProduct = createAsyncThunk(
  "ADD/PRODUCT",
  async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;

    try {
      return await productService.add(formData, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Product
export const deleteProduct = createAsyncThunk(
  "DELETE/PRODUCT",
  async (id, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return await productService.remove(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Approve Product
export const approveProduct = createAsyncThunk(
  "APPROVE/PRODUCT",
  async (id, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return await productService.approve(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Reject Product
export const rejectProduct = createAsyncThunk(
  "REJECT/PRODUCT",
  async (id, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return await productService.reject(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark Sold
export const markSoldProduct = createAsyncThunk(
  "SOLD/PRODUCT",
  async (id, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return await productService.markSold(id, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
