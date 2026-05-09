import React from 'react';
import { useAuth } from '../../contextApi/AuthContext';
import { Link } from 'react-router-dom';
import logo from "../../assets/logoi.jpeg";

const Header = () => {
    const { logout, user, loading } = useAuth();

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <div className="h-16 flex items-center justify-center bg-white border-b border-gray-200">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <header className="flex justify-between items-center py-3 px-6 bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
            <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-10 h-10 mr-3 rounded-xl shadow-sm object-cover" />
                <Link to="/" className="text-2xl font-black text-gray-900 tracking-tighter no-underline hover:text-blue-600 transition-colors">
                    SOCIALWORLD
                </Link>
            </div>
            <nav className="flex items-center gap-6">
                <Link to="/" className="text-sm font-semibold text-gray-700 no-underline hover:text-blue-600 transition-colors">
                    Home
                </Link>
                <Link to="/createpost" className="text-sm font-semibold text-gray-700 no-underline hover:text-blue-600 transition-colors">
                    Post
                </Link>
                <button 
                    onClick={handleLogout} 
                    className="text-sm font-semibold text-red-500 bg-red-50 py-2 px-4 rounded-full hover:bg-red-100 transition-all cursor-pointer"
                >
                    Logout
                </button>
                {user && (
                    <Link to={`/profile/${user?._id}`} className="ml-2 group">
                        <img
                            src={user?.userimage?.url || 'path/to/placeholder.png'}
                            alt={user?.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-500 transition-all shadow-sm"
                        />
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;

