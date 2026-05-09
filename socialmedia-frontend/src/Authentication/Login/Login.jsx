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
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>

            <div className="relative z-10 w-full max-w-[440px] px-6">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-[40px] p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center">
                    <div className="mb-10 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[28px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <img src={Logo} className="relative w-24 h-24 rounded-[24px] shadow-2xl object-cover ring-4 ring-white/10" alt="Logo" />
                    </div>

                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-white tracking-tight mb-3">Welcome back</h2>
                        <p className="text-gray-400 font-medium">Please enter your details to sign in</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@company.com"
                                onChange={handleChange}
                                required
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-md"
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
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-md"
                            />
                        </div>

                        <div className="flex items-center justify-between px-1 mt-1">
                            {/* <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/10 text-blue-600 focus:ring-blue-500/50" />
                                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                            </label> */}
                            <button type="button" className="text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</button>
                        </div>

                        <button
                            type="submit"
                            className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 overflow-hidden"
                            disabled={loading}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <span className="relative z-10">
                                {loading ? (
                                    <Box display="flex" alignItems="center" justifyContent="center">
                                        <CircularProgress size={24} color="inherit" thickness={5} />
                                    </Box>
                                ) : 'Sign In'}
                            </span>
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-transparent px-2 text-gray-500 font-bold">Or continue with</span></div>
                        </div>

                        {/* <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-semibold text-sm">
                                <i className="fa fa-google text-red-500"></i> Google
                            </button>
                            <button type="button" className="flex items-center justify-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-semibold text-sm">
                                <i className="fa fa-apple"></i> Apple
                            </button>
                        </div> */}

                        <p className="mt-8 text-center text-gray-400 font-medium">
                            New here? <Link to="/register" className="text-blue-500 hover:text-blue-400 font-bold ml-1 transition-colors">Create account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;


