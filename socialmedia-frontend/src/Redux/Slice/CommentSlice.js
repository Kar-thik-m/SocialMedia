import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
    comments: [],
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        getCommentRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getCommentSuccess(state, action) {
            state.loading = false;
            state.comments = action.payload;
        },
        getCommentFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        addCommentRequest(state) {
            state.loading = true;
            state.error = null;
        },
        addCommentSuccess(state, action) {
            state.loading = false;
            state.comments.push(action.payload);
        },
        addCommentFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteCommentRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteCommentSuccess(state, action) {
            state.loading = false;
            state.comments = state.comments.filter(comment => comment._id !== action.payload);
        },
        deleteCommentFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});


export const {
    getCommentRequest,
    getCommentSuccess,
    getCommentFailure,
    addCommentRequest,
    addCommentSuccess,
    addCommentFailure,
    deleteCommentRequest,
    deleteCommentSuccess,
    deleteCommentFailure,
} = commentSlice.actions;


export default commentSlice.reducer;
