import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../Redux/Action/ProfileAction';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const EditProfile = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = { username, file };

        setLoading(true);

        try {
            await dispatch(updateProfile(userData, id));
            setUsername("");
            setFile(null);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[60vh] px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                
                <div className="w-full mb-5">
                    <label className="block text-sm font-semibold text-gray-600 mb-2" htmlFor="username">
                        Username
                    </label>
                    <input
                        className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        type="text"
                        id="username"
                        placeholder="Enter new username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="w-full mb-8">
                    <label className="block text-sm font-semibold text-gray-600 mb-2" htmlFor="file">
                        Profile Image
                    </label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors cursor-pointer">
                        <input
                            type="file"
                            id="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center text-gray-500">
                            {file ? file.name : "Click to upload image"}
                        </div>
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-bold text-lg cursor-pointer transition-all duration-300 hover:bg-blue-700 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? (
                        <Box display="flex" alignItems="center" justifyContent="center">
                            <CircularProgress size={24} color="inherit" />
                        </Box>
                    ) : "Update Profile"}
                </button>
            </form>
        </div>
    );
};

export default EditProfile;