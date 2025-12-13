import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import eventService from "./eventService";

const eventsSlice = createSlice({
  name: "events",
  initialState: {
    allEvents: [],
    page: 1,
    pages: 1,
    total: 0,
    event: null,
    eventsLoading: false,
    eventsSuccess: false,
    eventsError: false,
    eventErrorMessage: "",
    rsvpLoading: false,
    rsvpSuccess: false,
  },
  reducers: {
    resetRsvp: (state) => {
      state.rsvpSuccess = false;
      state.rsvpLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEvents.pending, (state) => {
        state.eventsLoading = true;
        state.eventsSuccess = false;
        state.eventsError = false;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.eventsLoading = false;
        state.eventsSuccess = true;
        if (action.payload.events) {
          state.allEvents = action.payload.events;
          state.page = action.payload.page;
          state.pages = action.payload.pages;
          state.total = action.payload.total;
        } else {
          state.allEvents = action.payload;
        }
        state.eventsError = false;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.eventsLoading = false;
        state.eventsSuccess = false;
        state.eventsError = true;
        state.eventErrorMessage = action.payload;
      })
      .addCase(getEvent.pending, (state) => {
        state.eventsLoading = true;
        state.eventsSuccess = false;
        state.eventsError = false;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.eventsLoading = false;
        state.eventsSuccess = true;
        state.event = action.payload;
        state.eventsError = false;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.eventsLoading = false;
        state.eventsSuccess = false;
        state.eventsError = true;
        state.eventErrorMessage = action.payload;
      })
      .addCase(rsvpEvent.pending, (state) => {
        state.rsvpLoading = true;
      })
      .addCase(rsvpEvent.fulfilled, (state, action) => {
        state.rsvpLoading = false;
        state.rsvpSuccess = true;
        state.event = action.payload;
      })
      .addCase(rsvpEvent.rejected, (state, action) => {
        state.rsvpLoading = false;
        state.eventsError = true;
        state.eventErrorMessage = action.payload;
      });
  },
});

export const { resetRsvp } = eventsSlice.actions;
export default eventsSlice.reducer;

// GET EVENTS
export const getEvents = createAsyncThunk(
  "FETCH/EVENTS",
  async (params, thunkAPI) => {
    try {
      return await eventService.fetchEvents(params);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET EVENT
export const getEvent = createAsyncThunk(
  "FETCH/EVENT",
  async (eid, thunkAPI) => {
    try {
      return await eventService.fetchEvent(eid);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// RSVP EVENT
export const rsvpEvent = createAsyncThunk(
  "RSVP/EVENT",
  async (eid, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await eventService.rsvpEvent(eid, token);
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);
