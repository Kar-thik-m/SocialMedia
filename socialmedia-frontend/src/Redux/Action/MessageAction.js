import {
    postMessageFailure,
    postMessageRequest,
    postMessageSuccess,
    getmessageFailure,
    getmessageRequest,
    getmessageSuccess
} from "../Slice/MessageSlice";
import { Url } from "../../../.config";

export const postMessage = (id, message) => async (dispatch) => {
    try {
        dispatch(postMessageRequest());
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }
        if (!message) {
            throw new Error('Message content is required.');
        }

        const response = await fetch(`${Url}/messageuser/sendMessage/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            dispatch(postMessageFailure(errorData.message || 'Failed to send message'));
            return;
        }

        const data = await response.json();
        dispatch(postMessageSuccess(data));
    } catch (error) {
        dispatch(postMessageFailure(error.message));
    }
};

export const getMessages = (id) => async (dispatch) => {
    try {
        dispatch(getmessageRequest());
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${Url}/messageuser/getMessage/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            dispatch(getmessageFailure(errorData.message || 'Failed to fetch messages'));
            return;
        }

        const data = await response.json();
        dispatch(getmessageSuccess(data));
    } catch (error) {
        dispatch(getmessageFailure(error.message));
    }
};
