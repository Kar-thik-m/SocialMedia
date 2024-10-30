import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
    userByIdProfile: null,
    updateProfile: null,
    following: [],
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        getProfileRequest(state) {
            state.loading = true;
            state.error = null;
        },
        getProfileSuccess(state, action) {
            state.loading = false;
            state.userByIdProfile = action.payload;
        },
        getProfileFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        followingRequest(state) {
            state.loading = true;
        },
        followingSuccess(state, action) {
            state.loading = false;
            state.following = action.payload;
        },
        followingFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        unfollowRequest(state) {
            state.loading = true;
        },
        unfollowSuccess(state, action) {
            state.loading = false;

        },
        unfollowFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateRequest(state) {
            state.loading = true;
        },
        updateSuccess(state, action) {
            state.loading = false;
            state.updateProfile = action.payload;
        },
        updateFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    getProfileRequest,
    getProfileFailure,
    getProfileSuccess,
    followingRequest,
    followingSuccess,
    followingFailure,
    unfollowRequest,
    unfollowSuccess,
    unfollowFailure,
    updateFailure,
    updateRequest,
    updateSuccess
} = profileSlice.actions;
export default profileSlice.reducer;
