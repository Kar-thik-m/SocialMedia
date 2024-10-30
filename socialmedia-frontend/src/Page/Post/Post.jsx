import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PostStyle from "../Post/Post.module.css"; 
import { CreatePostAction } from '../../Redux/Action/PostAction';
import CircularProgress from '@mui/material/CircularProgress'; 
import { Box } from '@mui/material';     

const CreatePost = () => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('file', file);

        try {
            await dispatch(CreatePostAction(formData)); 
            setTitle('');
            setContent('');
            setFile(null);
        } catch (error) {
            setError('Error creating post: ' + error.message);
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={PostStyle.createPostContainer}>
            <h2 className={PostStyle.createPostTitle}>Create a New Post</h2>
            <form onSubmit={handleSubmit} className={PostStyle.formContainer}>
                <input
                    type="text"
                    placeholder="Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={PostStyle.postTitleInput}
                />
                <textarea
                    placeholder="Post Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className={PostStyle.postContentTextarea} 
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    className={PostStyle.fileInput}
                />
                <button type="submit" disabled={loading} className={PostStyle.submitPostButton}>
                    {loading ? (
                        <Box display="flex" alignItems="center">
                            <CircularProgress size={24} style={{ marginRight: 8 }} />
                            Creating...
                        </Box>
                    ) : (
                        'Create Post'
                    )}
                </button>
                {error && <p className={PostStyle.errorMessage}>{error}</p>}
            </form>
        </div>
    );
};

export default CreatePost;
