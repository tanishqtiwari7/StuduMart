import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import commentService from "./commentService";

const commentsSlice = createSlice({
    name: 'comments',
    initialState: {
        allComments: [],
        commentsLoading: false,
        commentsSuccess: false,
        commentsError: false,
        commentErrorMessage: ""
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getComments.pending, (state, action) => {
                state.commentsLoading = true
                state.commentsSuccess = false
                state.commentsError = false
            })
            .addCase(getComments.fulfilled, (state, action) => {
                state.commentsLoading = false
                state.allComments = action.payload
                state.commentsSuccess = true
                state.commentsError = false
            })
            .addCase(getComments.rejected, (state, action) => {
                state.commentsLoading = false
                state.commentsSuccess = false
                state.commentsError = true
                state.commentErrorMessage = action.payload
            })
            .addCase(addComment.pending, (state, action) => {
                state.commentsLoading = true
                state.commentsSuccess = false
                state.commentsError = false
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.commentsLoading = false
                state.allComments = [action.payload, ...state.allComments]
                state.commentsSuccess = true
                state.commentsError = false
            })
            .addCase(addComment.rejected, (state, action) => {
                state.commentsLoading = false
                state.commentsSuccess = false
                state.commentsError = true
                state.commentErrorMessage = action.payload
            })
    }
})


export default commentsSlice.reducer


export const getComments = createAsyncThunk("FETCH/COMMENTS", async (eid) => {
    try {
        return await commentService.fetchComments(eid)
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

export const addComment = createAsyncThunk("ADD/COMMENT", async (comment, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await commentService.createComment(comment, token)
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})