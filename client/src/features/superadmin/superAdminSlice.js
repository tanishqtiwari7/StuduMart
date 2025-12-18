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
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
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
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Branch
export const updateBranch = createAsyncThunk(
  "superadmin/updateBranch",
  async ({ id, branchData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.updateBranch(id, branchData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Branch
export const deleteBranch = createAsyncThunk(
  "superadmin/deleteBranch",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.deleteBranch(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
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
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
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
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Club
export const updateClub = createAsyncThunk(
  "superadmin/updateClub",
  async ({ id, clubData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.updateClub(id, clubData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
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
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
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
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Admin
export const updateAdmin = createAsyncThunk(
  "superadmin/updateAdmin",
  async ({ id, adminData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.updateAdmin(id, adminData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete Admin
export const deleteAdmin = createAsyncThunk(
  "superadmin/deleteAdmin",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await superAdminService.deleteAdmin(id, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
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
      .addCase(getBranches.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getBranches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches = action.payload;
      })
      .addCase(getBranches.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBranch.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.branches.push(action.payload);
        state.isSuccess = true;
        state.message = "Branch created successfully";
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateBranch.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Branch updated successfully";
        const index = state.branches.findIndex(
          (branch) => branch._id === action.payload._id
        );
        if (index !== -1) {
          state.branches[index] = action.payload;
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteBranch.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Branch deleted successfully";
        state.branches = state.branches.filter(
          (branch) => branch._id !== action.payload.id
        );
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Clubs
      .addCase(getClubs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getClubs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clubs = action.payload;
      })
      .addCase(getClubs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createClub.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createClub.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clubs.push(action.payload);
        state.isSuccess = true;
        state.message = "Club created successfully";
      })
      .addCase(createClub.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateClub.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateClub.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Club updated successfully";
        const index = state.clubs.findIndex(
          (club) => club._id === action.payload._id
        );
        if (index !== -1) {
          state.clubs[index] = action.payload;
        }
      })
      .addCase(updateClub.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Admins
      .addCase(getAdmins.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(getAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins = action.payload;
      })
      .addCase(getAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins.unshift(action.payload);
        state.isSuccess = true;
        state.message = "Admin created successfully";
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Admin updated successfully";
        const index = state.admins.findIndex(
          (admin) => admin._id === action.payload._id
        );
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = "Admin deleted successfully";
        state.admins = state.admins.filter(
          (admin) => admin._id !== action.payload.id
        );
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetSuperAdmin } = superAdminSlice.actions;
export default superAdminSlice.reducer;
