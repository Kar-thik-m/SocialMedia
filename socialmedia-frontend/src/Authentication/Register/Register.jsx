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
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans py-12">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            
            <div className="relative z-10 w-full max-w-[500px] px-6">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[40px] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center">
                    <div className="mb-8 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[28px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img src={Logo} className="relative w-20 h-20 rounded-[24px] shadow-2xl object-cover ring-4 ring-white/10" alt="Logo" />
                    </div>
                    
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black text-white tracking-tight mb-3">Join us today</h2>
                        <p className="text-gray-400 font-medium">Create your account to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
                        <div className="grid grid-cols-1 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                <input 
                                    type="text" 
                                    name="username" 
                                    placeholder="johndoe" 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-md"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email" 
                                    placeholder="name@company.com" 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-md"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                                <input 
                                    type="password" 
                                    name="password" 
                                    placeholder="••••••••" 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300 backdrop-blur-md"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Profile Image</label>
                                <div className="relative group">
                                    <input 
                                        type="file" 
                                        name="image" 
                                        accept="image/*" 
                                        onChange={handleChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="w-full p-4 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl text-gray-400 flex items-center justify-center gap-3 group-hover:border-indigo-500/50 group-hover:bg-white/10 transition-all duration-300">
                                        <i className="fa fa-cloud-upload text-xl"></i>
                                        <span className="text-sm font-semibold truncate max-w-[200px]">
                                            {formData.image ? formData.image.name : "Choose an image"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-start gap-2 px-1 mt-2">
                            <input type="checkbox" required className="mt-1 w-4 h-4 rounded bg-white/5 border-white/10 text-indigo-600 focus:ring-indigo-500/50" id="terms" />
                            <label htmlFor="terms" className="text-sm text-gray-400 leading-tight">
                                I agree to the <button type="button" className="text-indigo-500 hover:underline">Terms of Service</button> and <button type="button" className="text-indigo-500 hover:underline">Privacy Policy</button>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 overflow-hidden" 
                            disabled={loading}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10">
                                {loading ? (
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <CircularProgress size={24} color="inherit" thickness={5} />
                                    </Box>
                                ) : 'Create Account'}
                            </span>
                        </button>
                        
                        <p className="mt-8 text-center text-gray-400 font-medium">
                            Already have an account? <Link to="/login" className="text-indigo-500 hover:text-indigo-400 font-bold ml-1 transition-colors">Sign in</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;


