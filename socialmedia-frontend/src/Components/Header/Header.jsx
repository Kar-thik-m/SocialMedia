import React from 'react';
import { useAuth } from '../../contextApi/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import logo from "../../assets/logoi.jpeg";

const Header = () => {
    const { logout, user, loading } = useAuth();
    const location = useLocation();

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div className="h-20 flex items-center justify-center bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const navLinkClass = (path) => `
        flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300
        ${location.pathname === path 
            ? 'bg-blue-50 text-blue-600 shadow-sm' 
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
    `;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-gray-200/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                
                {/* Logo Section */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                        <img src={logo} alt="Logo" className="relative w-9 h-9 rounded-xl shadow-sm object-cover" />
                    </div>
                    <Link to="/" className="hidden md:block text-xl font-black text-gray-900 tracking-tighter hover:text-blue-600 transition-colors">
                        SOCIALWORLD
                    </Link>
                </div>

                {/* Search Bar - Center */}
                <div className="flex-1 max-w-md hidden sm:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <i className="fa fa-search text-gray-400 group-focus-within:text-blue-500 transition-colors"></i>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Search everything..." 
                            className="w-full bg-gray-100/50 border border-transparent focus:bg-white focus:border-blue-500/30 focus:ring-4 focus:ring-blue-500/5 py-2 pl-10 pr-4 rounded-2xl text-sm transition-all duration-300 outline-none"
                        />
                    </div>
                </div>

                {/* Navigation Section */}
                <nav className="flex items-center gap-2 sm:gap-4">
                    <Link to="/" className={navLinkClass('/')} title="Home">
                        <i className="fa fa-home text-lg"></i>
                    </Link>
                    <Link to="/chat" className={navLinkClass('/chat')} title="Messages">
                        <i className="fa fa-paper-plane-o text-lg"></i>
                    </Link>
                    <Link to="/createpost" className={navLinkClass('/createpost')} title="New Post">
                        <i className="fa fa-plus-square-o text-lg"></i>
                    </Link>
                    
                    <div className="h-6 w-[1px] bg-gray-200 mx-1 hidden xs:block"></div>

                    {user && (
                        <div className="flex items-center gap-3">
                            <Link to={`/profile/${user?._id}`} className="flex items-center gap-2 group p-1 pr-3 rounded-full hover:bg-gray-50 transition-all">
                                <img
                                    src={user?.userimage?.url || 'https://via.placeholder.com/150'}
                                    alt={user?.username}
                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-blue-500/30 transition-all shadow-sm"
                                />
                                <span className="hidden lg:block text-xs font-bold text-gray-700">{user?.username}</span>
                            </Link>
                            
                            <button 
                                onClick={handleLogout} 
                                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300"
                                title="Logout"
                            >
                                <i className="fa fa-sign-out text-lg"></i>
                            </button>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;


