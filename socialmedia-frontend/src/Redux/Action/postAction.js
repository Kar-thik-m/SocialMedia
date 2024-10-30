import {
    postFailure,
    postRequest,
    postSuccess,
    getallpostFailure,
    getallpostRequest,
    getallpostSuccess,
    likePostRequest,
    likePostSuccess,
    likePostFailure,
    unlikePostRequest,
    unlikePostSuccess,
    unlikePostFailure
} from "../Slice/PostSlice";

export const GetPostAll = () => async (dispatch) => {
    try {
        dispatch(getallpostRequest());
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:4000/item/getitemposts`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const error = await response.text();
            dispatch(getallpostFailure(error));
            return;
        }
        const data = await response.json();
        dispatch(getallpostSuccess(data));
    } catch (error) {
        dispatch(getallpostFailure(error.toString()));
    }
};

export const CreatePostAction = (formData) => async (dispatch) => {
    try {
        dispatch(postRequest());
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:4000/item/itempost', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to create post');
        }

        const data = await response.json();
        dispatch(postSuccess(data));
    } catch (err) {
        dispatch(postFailure(err.message));
    }
};

export const PostLike = (postId) => async (dispatch) => {
    try {
        dispatch(likePostRequest());
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:4000/item/itempost/like/${postId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to like post');
        }

        const data = await response.json(); 
        dispatch(likePostSuccess(postId )); 
    } catch (err) {
        dispatch(likePostFailure(err.message)); 
        console.error('Error liking post:', err.message);
    }
};


export const PostUnlike = (postId) => async (dispatch) => {
    try {
        dispatch(unlikePostRequest());
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await fetch(`http://localhost:4000/item/itempost/unlike/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Failed to unlike post');
        }

        
     
        dispatch(unlikePostSuccess(postId)); 
    } catch (err) {
        dispatch(unlikePostFailure(err.message));
        console.error('Error unliking post:', err.message);
    }
};

