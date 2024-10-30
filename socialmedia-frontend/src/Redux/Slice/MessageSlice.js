import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
    onlineUsers: [],
    messages: [],
};

const commentSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        getmessageRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getmessageSuccess(state, action) {
            state.loading = false;
            state.messages = action.payload;
        },
        getmessageFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        postMessageRequest(state) {
            state.loading = true;
            state.error = null;
        },
        postMessageSuccess(state, action) {
            state.loading = false;
            state.messages = action.payload;
        },
        postMessageFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteMessageRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteMessageSuccess(state, action) {
            state.loading = false;
            state.messages = state.messages.filter(message => message._id !== action.payload);
        },
        deleteMessageFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        setOnlineUsers(state, action) {
            state.onlineUsers = action.payload;
        },
    },
});

export const {
    getmessageFailure,
    getmessageRequest, getmessageSuccess,
    postMessageRequest,
    postMessageSuccess,
    postMessageFailure,
    deleteMessageRequest,
    deleteMessageSuccess,
    deleteMessageFailure,
    setOnlineUsers
} = commentSlice.actions;

export default commentSlice.reducer;
