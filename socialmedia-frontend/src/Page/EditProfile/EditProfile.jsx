import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../Redux/Action/ProfileAction';
import UpStyle from "../EditProfile/Edit.module.css";
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
        <form onSubmit={handleSubmit} className={UpStyle.editform} >
            <div className={UpStyle.labeltext}>
                <label className={UpStyle.editlabel} htmlFor="username">Username:</label>
                <input
                className={UpStyle.editinput}
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className={UpStyle.labelfile}>
                <label htmlFor="file">Profile Image:</label>
                <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            <button  type="submit" className={UpStyle.buttonupdate} disabled={loading}>
                {loading ? <CircularProgress size={24} /> : "Update Profile"}
            </button>
        </form>
    );
};

export default EditProfile;