import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../Redux/Action/ProfileAction';
import { useParams, useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const EditProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

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
        const userData = { username, file };

        setLoading(true);

        try {
            await dispatch(updateProfile(userData, id));
            setUsername("");
            setFile(null);
            setPreview(null);
            navigate(`/profile/${id}`);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12 font-sans">
            <div className="w-full max-w-xl">
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-8 flex items-center gap-2 text-gray-400 hover:text-gray-900 font-bold text-sm transition-colors uppercase tracking-widest"
                >
                    <i className="fa fa-arrow-left"></i> Back to profile
                </button>
                
                <div className="bg-white rounded-[48px] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100/50">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3">Edit Profile</h2>
                        <p className="text-gray-400 font-medium">Update your account information</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Image Upload Preview */}
                        <div className="flex flex-col items-center">
                            <div className="relative group mb-4">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-50">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <i className="fa fa-user text-5xl"></i>
                                        </div>
                                    )}
                                    <label htmlFor="file" className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <i className="fa fa-camera text-white text-2xl"></i>
                                    </label>
                                </div>
                                <input
                                    type="file"
                                    id="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Change avatar</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1" htmlFor="username">
                                    New Username
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <i className="fa fa-at text-gray-300"></i>
                                    </div>
                                    <input
                                        className="w-full p-4 pl-10 bg-gray-50 border border-transparent rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all duration-300 font-medium"
                                        type="text"
                                        id="username"
                                        placeholder="johndoe"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white py-4 px-8 rounded-2xl font-black text-lg cursor-pointer transition-all duration-300 hover:bg-blue-700 shadow-[0_10px_25px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] active:scale-[0.98] disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400 disabled:cursor-not-allowed mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
                                        <CircularProgress size={20} color="inherit" thickness={6} />
                                        <span>UPDATING...</span>
                                    </Box>
                                ) : "SAVE CHANGES"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
