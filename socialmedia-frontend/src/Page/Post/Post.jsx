import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { CreatePostAction } from '../../Redux/Action/postAction';
import CircularProgress from '@mui/material/CircularProgress'; 
import { Box } from '@mui/material';     
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
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
            setPreview(null);
            navigate('/');
        } catch (error) {
            setError('Error creating post: ' + error.message);
            console.error('Error creating post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12 font-sans">
            <div className="w-full max-w-2xl">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm transition-colors uppercase tracking-widest"
                >
                    <i className="fa fa-arrow-left"></i> Back to feed
                </button>

                <div className="bg-white rounded-[48px] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100/50">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Create Post</h2>
                        <p className="text-gray-400 font-medium">Share your thoughts with the world</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Post Title</label>
                            <input
                                type="text"
                                placeholder="What's on your mind?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all duration-300 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Content</label>
                            <textarea
                                placeholder="Tell us more about it..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="w-full h-40 resize-none p-4 bg-gray-50 border border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all duration-300 font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Media</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    id="post-file"
                                    onChange={handleFileChange}
                                    required={!preview}
                                    className="hidden"
                                />
                                <label 
                                    htmlFor="post-file" 
                                    className={`relative flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-[32px] cursor-pointer transition-all duration-500 overflow-hidden ${
                                        preview 
                                        ? "border-transparent bg-gray-50" 
                                        : "border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-blue-500/50"
                                    }`}
                                >
                                    {preview ? (
                                        <div className="relative w-full h-full group/image">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-[30px]" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-bold text-sm bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">Change image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4 p-8">
                                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500">
                                                <i className="fa fa-image text-3xl"></i>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-900 font-bold">Drop your image here</p>
                                                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mt-1">or click to browse</p>
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="w-full bg-blue-600 text-white py-4 px-8 rounded-2xl font-black text-lg cursor-pointer transition-all duration-300 hover:bg-blue-700 shadow-[0_10px_25px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? (
                                <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                                    <CircularProgress size={20} color="inherit" thickness={6} />
                                    <span>POSTING...</span>
                                </Box>
                            ) : (
                                'SHARE POST'
                            )}
                        </button>
                        
                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-center text-sm font-bold border border-red-100 animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;


