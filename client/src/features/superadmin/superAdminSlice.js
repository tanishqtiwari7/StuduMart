import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import superAdminService from "./superAdminService";

const initialState = {
  stats: null,
  branches: [],
  clubs: [],
  admins: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

// Get Stats
export const getStats = createAsyncThunk(
  "superadmin/getStats",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.getStats(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Branches
export const getBranches = createAsyncThunk(
  "superadmin/getBranches",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.getAllBranches(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Branch
export const createBranch = createAsyncThunk(
  "superadmin/createBranch",
  async (branchData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.createBranch(branchData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Clubs
export const getClubs = createAsyncThunk(
  "superadmin/getClubs",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.getAllClubs(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Club
export const createClub = createAsyncThunk(
  "superadmin/createClub",
  async (clubData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.createClub(clubData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get Admins
export const getAdmins = createAsyncThunk(
  "superadmin/getAdmins",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.getAllAdmins(token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create Admin
export const createAdmin = createAsyncThunk(
  "superadmin/createAdmin",
  async (adminData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.createAdmin(adminData, token);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const superAdminSlice = createSlice({
  name: "superadmin",
  initialState,
  reducers: {
    resetSuperAdmin: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Stats
      .addCase(getStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.stats = action.payload;
      })
      .addCase(getStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Branches
      .addCase(getBranches.fulfilled, (state, action) => {
        state.branches = action.payload;
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.branches.push(action.payload);
        state.isSuccess = true;
        state.message = "Branch created successfully";
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload;
      })
      // Clubs
      .addCase(getClubs.fulfilled, (state, action) => {
        state.clubs = action.payload;
      })
      .addCase(createClub.fulfilled, (state, action) => {
        state.clubs.push(action.payload);
        state.isSuccess = true;
        state.message = "Club created successfully";
      })
      // Admins
      .addCase(getAdmins.fulfilled, (state, action) => {
        state.admins = action.payload;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.admins.unshift(action.payload);
        state.isSuccess = true;
        state.message = "Admin created successfully";
      });
  },
});

export const { resetSuperAdmin } = superAdminSlice.actions;
export default superAdminSlice.reducer;
