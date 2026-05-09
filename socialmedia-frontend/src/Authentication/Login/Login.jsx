import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contextApi/AuthContext';
import Logo from '../../assets/logoi.jpeg';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Login = () => {
    const navigate = useNavigate();
    const { login, user, loading } = useAuth(); 
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-[400px] flex flex-col items-center border border-gray-100">
                <div className="mb-8">
                    <img src={Logo} className="w-20 h-20 rounded-2xl shadow-md object-cover" alt="Logo" />
                </div>
                <h2 className="text-3xl font-extrabold mb-8 text-gray-800 tracking-tight text-center">Welcome Back</h2>
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
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
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed mt-2" 
                        disabled={loading}
                    >
                        {loading ? (
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <CircularProgress size={24} color="inherit" />
                            </Box>
                        ) : 'Login'}
                    </button>
                    <p className="mt-8 text-center text-gray-500 font-medium">
                        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-bold">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;

