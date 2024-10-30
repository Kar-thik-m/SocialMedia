import React from 'react';
import { useAuth } from '../../contextApi/AuthContext';
import { Link } from 'react-router-dom';
import logo from "../../assets/logoi.jpeg";
import hstyles from './Header.module.css';

const Header = () => {
    const { logout, user, loading } = useAuth();

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    console.log(user)
    return (
        <header className={hstyles.header}>
            <div className={hstyles.logo}>
                <img src={logo} alt="Logo" className={hstyles.logoImage} />
                <Link to="/" className={hstyles.logoText}>Socialworld</Link>
            </div>
            <nav className={hstyles.nav}>
                <Link to="/" className={hstyles.navLink}>Home</Link>
                <Link to="/createpost" className={hstyles.navLink}>Post</Link>
                <button onClick={handleLogout} className={hstyles.logoutButton}>
                    Logout
                </button>
                {user && (
                    <>
                        <Link to={`/profile/${user?._id}`}>
                            <img
                                src={user?.userimage?.url || 'path/to/placeholder.png'}
                                alt={user?.username}
                                className={hstyles.userImage}
                            />
                        </Link>
                        
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
