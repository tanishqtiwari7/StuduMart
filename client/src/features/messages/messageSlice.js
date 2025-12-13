import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import messageService from "./messageService";


const messageSlice = createSlice({
    name: 'message',
    initialState: {
        allMessages: [],
        messageLoading: false,
        messageSuccess: false,
        messageError: false,
        messageErrorMessage: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMessages.pending, (state, action) => {
                state.messageLoading = true
                state.messageSuccess = false
                state.messageError = false
            })
            .addCase(getMessages.fulfilled, (state, action) => {
                state.messageLoading = false
                state.allMessages = action.payload
                state.messageSuccess = false
                state.messageError = false
            })
            .addCase(getMessages.rejected, (state, action) => {
                state.messageLoading = false
                state.messageSuccess = false
                state.messageError = true
                state.messageErrorMessage = false
            })
            .addCase(addMessage.pending, (state, action) => {
                state.messageLoading = true
                state.messageSuccess = false
                state.messageError = false
            })
            .addCase(addMessage.fulfilled, (state, action) => {
                state.messageLoading = false
                state.allMessages = [action.payload, ...state.allMessages]
                state.messageSuccess = true
                state.messageError = false
            })
            .addCase(addMessage.rejected, (state, action) => {
                state.messageLoading = false
                state.messageSuccess = false
                state.messageError = true
                state.messageErrorMessage = false
            })
    }
})


export default messageSlice.reducer

// Get Messages

export const getMessages = createAsyncThunk("FETCH/MESSAGES", async (_, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await messageService.fetchMessages(token)
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Send Messages

export const addMessage = createAsyncThunk("SEND/MESSAGE", async (pid, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await messageService.sendMessage(pid, token)
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})