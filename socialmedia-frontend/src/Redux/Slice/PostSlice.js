import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    posts: null,
    loading: false,
    error: null,
    getallposts: null,
    Like:null,
    Unlike:null
};

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        postRequest(state) {
            state.loading = true;
            state.error = null;
        },
        postSuccess(state, action) {
            state.loading = false;
            state.posts = action.payload;
        },
        postFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        getallpostRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getallpostSuccess(state, action) {
            state.loading = false;
            state.getallposts = action.payload;
        },
        getallpostFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        likePostRequest(state) {
            state.loading = true;
            state.error = null;
        },
        likePostSuccess(state, action) {
            state.loading = false;
            const postId = action.payload;
            const post = state.getallposts.find(post => post._id === postId);
            if (!post) {
                post.likes.push(postId);
            }
            state.Like="Like success"
        },
        likePostFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        unlikePostRequest(state) {
            state.loading = true;
            state.error = null;
        },
        unlikePostSuccess(state, action) {
            state.loading = false;
            const postId = action.payload;
            const post = state.getallposts.find(post => post._id === postId);
            if (post) {
                post.likes = post.likes.filter(like => like !== postId); 
            }
             state.Unlike="Like success"
        },
        unlikePostFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    postRequest,
    postSuccess,
    postFailure,
    getallpostRequest,
    getallpostSuccess,
    getallpostFailure,
    likePostRequest,
    likePostSuccess,
    likePostFailure,
    unlikePostRequest,
    unlikePostSuccess,
    unlikePostFailure,
} = postSlice.actions;

export default postSlice.reducer;
