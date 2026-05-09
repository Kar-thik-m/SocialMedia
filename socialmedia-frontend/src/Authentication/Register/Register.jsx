import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contextApi/AuthContext';
import Logo from '../../assets/logoi.jpeg';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Register = () => {
    const navigate = useNavigate();
    const { register, loading, user } = useAuth(); 
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'image' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('username', formData.username);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('file', formData.image);

        try {
            await register(data);
        } catch (error) {
            console.error('Registration failed:', error.message);
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-[450px] flex flex-col items-center border border-gray-100">
                <div className="mb-6">
                    <img src={Logo} className="w-20 h-20 rounded-2xl shadow-md object-cover" alt="Logo" />
                </div>
                <h2 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight text-center">Create Account</h2>
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        onChange={handleChange} 
                        required 
                        className="p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-gray-700"
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email Address" 
                        onChange={handleChange} 
                        required 
                        className="p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-gray-700"
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                        className="p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-gray-700"
                    />
                    <div className="relative group">
                        <input 
                            type="file" 
                            name="image" 
                            accept="image/*" 
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center group-hover:border-blue-400 transition-colors">
                            {formData.image ? formData.image.name : "Upload Profile Image"}
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed mt-4" 
                        disabled={loading}
                    >
                        {loading ? (
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <CircularProgress size={24} color="inherit" />
                            </Box>
                        ) : 'Create Account'}
                    </button>
                    <p className="mt-8 text-center text-gray-500 font-medium">
                        Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-bold">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;

