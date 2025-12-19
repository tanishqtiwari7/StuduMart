import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import adminService from "./adminService";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    allUsers: [],
    allEvents: [],
    allListings: [],
    allComments: [],
    edit: {
      event: {},
      isEdit: false,
    },
    adminLoading: false,
    adminSuccess: false,
    adminError: false,
    adminErrorMessage: "",
  },
  reducers: {
    editEvent: (state, action) => {
      return {
        ...state,
        edit: {
          event: action.payload,
          isEdit: true,
        },
      };
    },
    resetEdit: (state) => {
      state.edit = {
        event: {},
        isEdit: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state, action) => {
        state.adminLoading = true;
        state.adminSuccess = false;
        state.adminError = false;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = true;
        state.allUsers = action.payload;
        state.adminError = false;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = false;
        state.adminError = true;
        state.adminErrorMessage = action.payload;
      })
      .addCase(getAllEvents.pending, (state, action) => {
        state.adminLoading = true;
        state.adminSuccess = false;
        state.adminError = false;
      })
      .addCase(getAllEvents.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = true;
        // Handle both array (old API) and paginated object (new API)
        state.allEvents = Array.isArray(action.payload)
          ? action.payload
          : action.payload.events || [];
        state.adminError = false;
      })
      .addCase(getAllEvents.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = false;
        state.adminError = true;
        state.adminErrorMessage = action.payload;
      })
      .addCase(getAllListings.pending, (state, action) => {
        state.adminLoading = true;
        state.adminSuccess = false;
        state.adminError = false;
      })
      .addCase(getAllListings.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = true;
        state.allListings = action.payload;
        state.adminError = false;
      })
      .addCase(getAllListings.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = false;
        state.adminError = true;
        state.adminErrorMessage = action.payload;
      })
      .addCase(updateListing.pending, (state, action) => {
        state.adminLoading = true;
        state.adminSuccess = false;
        state.adminError = false;
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = true;
        state.allListings = state.allListings.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
        state.adminError = false;
      })
      .addCase(updateListing.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = false;
        state.adminError = true;
        state.adminErrorMessage = action.payload;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.adminLoading = true;
        state.adminSuccess = false;
        state.adminError = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = true;
        state.allUsers = state.allUsers.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
        state.adminError = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = false;
        state.adminError = true;
        state.adminErrorMessage = action.payload;
      })
      .addCase(addEvent.pending, (state, action) => {
        state.adminLoading = true;
        state.adminSuccess = false;
        state.adminError = false;
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = true;
        state.allEvents = [action.payload, ...state.allEvents];
        state.edit = { event: {}, isEdit: false };
        state.adminError = false;
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = false;
        state.adminError = true;
        state.adminErrorMessage = action.payload;
      })
      .addCase(updateEvent.pending, (state, action) => {
        state.adminLoading = true;
        state.adminSuccess = false;
        state.adminError = false;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = true;
        state.allEvents = state.allEvents.map((event) =>
          event._id === action.payload._id ? action.payload : event
        );
        state.edit = { event: {}, isEdit: false };
        state.adminError = false;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminSuccess = false;
        state.adminError = true;
        state.adminErrorMessage = action.payload;
      });
  },
});

export const { editEvent, resetEdit } = adminSlice.actions;

export default adminSlice.reducer;

// FETCH ALL USERS : (ADMIN)
export const getAllUsers = createAsyncThunk(
  "FETCH/USERS/ADMIN",
  async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;

    try {
      return await adminService.fetchAllUsers(token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// FETCH ALL EVENTS : (ADMIN)
export const getAllEvents = createAsyncThunk(
  "FETCH/EVENTS/ADMIN",
  async (_, thunkAPI) => {
    try {
      return await adminService.fetchAllEvents();
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// FETCH ALL LISTINGS : (ADMIN)
export const getAllListings = createAsyncThunk(
  "FETCH/LISTINGS/ADMIN",
  async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return await adminService.fetchAllListings(token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// UPDATE LISTING : (ADMIN)
export const updateListing = createAsyncThunk(
  "UPDATE/LISTING/ADMIN",
  async (updatedProduct, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return await adminService.updateListing(updatedProduct, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// UPDATE USER : (ADMIN)
export const updateUser = createAsyncThunk(
  "UPDATE/USER/ADMIN",
  async (updatedUser, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return await adminService.updateUser(updatedUser, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add Event (ADMIN)  :

export const addEvent = createAsyncThunk(
  "ADD/EVENT/ADMIN",
  async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return adminService.createEvent(formData, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update Event (ADMIN)  :

export const updateEvent = createAsyncThunk(
  "UPDATE/EVENT/ADMIN",
  async (updatedEvent, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return adminService.update(updatedEvent, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Invite User (ADMIN)
export const inviteUser = createAsyncThunk(
  "INVITE/USER/ADMIN",
  async (userId, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token;
    try {
      return await adminService.inviteUser(userId, token);
    } catch (error) {
      const message = error.response.data.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
