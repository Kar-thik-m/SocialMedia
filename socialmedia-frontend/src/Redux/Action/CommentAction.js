import {
    getCommentRequest,
    getCommentFailure,
    getCommentSuccess,
    addCommentFailure,
    addCommentRequest,
    addCommentSuccess,
    deleteCommentFailure,
    deleteCommentRequest,
    deleteCommentSuccess
} from "../Slice/CommentSlice";
import { Url } from "../../../config";

export const GetAllComments = (id) => async (dispatch) => {
    dispatch(getCommentRequest());
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${Url}/comment/getcomment/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            dispatch(getCommentFailure(error));
            return;
        }

        const data = await response.json();
        dispatch(getCommentSuccess(data));
    } catch (error) {
        dispatch(getCommentFailure(error.message || 'An error occurred'));
    }
};

export const AddCommentsPost = (commentText, postId, user) => async (dispatch) => {
    dispatch(addCommentRequest());
    const token = localStorage.getItem('token');

    try {
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${Url}/comment/postcomment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentText, postId }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create post');
        }

        const data = await response.json();

        if (!data.commentText || !data.createdAt || !data.userId || !data.postId || !data._id) {
            throw new Error('Incomplete data received from server');
        }

        const UpdateData = {
            commentText: data.commentText,
            createdAt: data.createdAt,
            userId: user,
            postId: data.postId,
            _id: data._id
        }
        dispatch(addCommentSuccess(UpdateData));
    } catch (err) {
        dispatch(addCommentFailure(err.message));
    }
};

export const DeleteCommentPost = (id) => async (dispatch) => {
    dispatch(deleteCommentRequest());
    const token = localStorage.getItem('token');

    try {
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`${Url}/comment/postcomment/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to delete comment');
        }
        dispatch(deleteCommentSuccess(id));
    } catch (err) {
        dispatch(deleteCommentFailure(err.message));
        console.error('Error deleting comment:', err.message);
    }
};
