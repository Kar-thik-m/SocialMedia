import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CreatePostAction } from '../../Redux/Action/postAction';
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
        <div className="max-w-[600px] my-8 mx-auto p-6 border-2 border-gray-200 rounded-xl bg-white shadow-lg">
            <h2 className="text-2xl mb-5 text-gray-700 text-center font-bold">Create a New Post</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    placeholder="Post Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full p-3 my-3 border border-gray-300 rounded-lg text-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none"
                />
                <textarea
                    placeholder="Post Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full h-32 resize-none p-3 my-3 border border-gray-300 rounded-lg text-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none"
                />
                <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    className="w-full p-3 my-3 border border-gray-300 rounded-lg text-sm transition-colors duration-300 focus:border-blue-500 focus:outline-none"
                />
                <button type="submit" disabled={loading} className="w-full p-3.5 bg-green-600 text-white rounded-lg text-base cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
                    {loading ? (
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <CircularProgress size={24} color="inherit" style={{ marginRight: 8 }} />
                            Creating...
                        </Box>
                    ) : (
                        'Create Post'
                    )}
                </button>
                {error && <p className="text-red-500 mt-3 text-center text-sm">{error}</p>}
            </form>
        </div>
    );
};

export default CreatePost;

