import {
    getProfileRequest,
    getProfileFailure,
    getProfileSuccess,
    followingFailure,
    followingRequest,
    followingSuccess,
    unfollowFailure,
    unfollowRequest,
    unfollowSuccess,
    updateFailure,
    updateRequest,
    updateSuccess
} from "../Slice/UserProfileSlice";

import { Url } from "../../../config";

export const GetProfileByUser = (id) => async (dispatch) => {
    dispatch(getProfileRequest());
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${Url}/user/profile/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(getProfileFailure(error));
            return;
        }

        const data = await response.json();
        dispatch(getProfileSuccess(data));
    } catch (error) {
        dispatch(getProfileFailure(error.message || 'An error occurred'));
    }
};

export const Follow = (id) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        dispatch(followingRequest());

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${Url}/user/follow/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Network response was not ok');
        }

        await response.json();
        dispatch(followingSuccess(id));
    } catch (error) {
        console.error('Error:', error);
        dispatch(followingFailure(error.toString()));
    }
};

export const UnFollow = (id) => async (dispatch) => {
    try {
        const token = localStorage.getItem('token');
        dispatch(unfollowRequest());

        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${Url}/user/unfollow/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Network response was not ok');
        }

        await response.json();
        dispatch(unfollowSuccess(id));
    } catch (error) {
        console.error('Error:', error);
        dispatch(unfollowFailure(error.toString()));
    }
};

export const updateProfile = (userData, userId) => async (dispatch) => {
    try {
        dispatch(updateRequest());

        const token = localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found');
        }

        const formData = new FormData();
        if (userData.username) {
            formData.append('username', userData.username);
        }
        if (userData.file) {
            formData.append('file', userData.file);
        }

        const response = await fetch(`${Url}/user/updateprofile/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Network response was not ok');
        }

        const data = await response.json();
        dispatch(updateSuccess(data));
    } catch (error) {
        console.error('Error updating profile:', error);
        dispatch(updateFailure(error.toString()));
    }
};
