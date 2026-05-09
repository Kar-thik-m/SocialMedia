import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetProfileByUser, UnFollow, Follow } from "../../Redux/Action/ProfileAction";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useAuth } from "../../contextApi/AuthContext";

const Profile = () => {
    const { id } = useParams();
    const { user, loading } = useAuth();
    const { userByIdProfile } = useSelector((state) => state.profile);
    const [modalType, setModalType] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GetProfileByUser(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (user && userByIdProfile) {
            setIsFollowing(user.followers.includes(userByIdProfile._id));
        }
    }, [user, userByIdProfile]);

    const toggleModal = (type) => {
        setModalType((prev) => (prev === type ? null : type));
    };

    const handleFollowToggle = async () => {
        const action = isFollowing ? UnFollow : Follow;
        try {
            await dispatch(action(userByIdProfile._id));
            setIsFollowing(!isFollowing);
        } catch (error) {
            alert(error.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans">
            {userByIdProfile && user && (
                <div className="max-w-5xl mx-auto px-4 pt-12">
                    {/* Hero Section / Profile Card */}
                    <div className="relative bg-white rounded-[48px] p-8 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100/50 overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full -ml-20 -mb-20 blur-3xl opacity-50"></div>

                        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-12">
                            {/* Avatar Section */}
                            <div className="relative shrink-0 group">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-2 bg-white shadow-2xl">
                                    <img 
                                        className="w-full h-full rounded-full object-cover shadow-inner ring-4 ring-gray-50" 
                                        src={userByIdProfile?.userimage?.url} 
                                        alt="Profile" 
                                    />
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 text-center md:text-left mt-4 md:mt-0">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6">
                                    <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
                                        {userByIdProfile.username}
                                    </h1>
                                    <div className="flex gap-4 justify-center md:justify-start">
                                        {user._id === userByIdProfile._id ? (
                                            <Link 
                                                className="bg-gray-900 text-white py-3 px-8 rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95 flex items-center gap-2" 
                                                to={`/editprofile/${user._id}`}
                                            >
                                                <i className="fa fa-edit"></i> Edit Profile
                                            </Link>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={handleFollowToggle} 
                                                    className={`py-3 px-10 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
                                                        isFollowing 
                                                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-gray-100" 
                                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100"
                                                    }`}
                                                >
                                                    {isFollowing ? "Following" : "Follow"}
                                                </button>
                                                <Link 
                                                    className="bg-white text-gray-900 py-3 px-8 rounded-2xl font-bold text-sm border border-gray-200 hover:bg-gray-50 transition-all shadow-sm active:scale-95 flex items-center gap-2" 
                                                    to={`/inbox/${id}`}
                                                >
                                                    <i className="fa fa-paper-plane-o"></i> Message
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <p className="text-xl font-medium text-gray-400 mb-8 lowercase tracking-wide">
                                    @{userByIdProfile.email.split('@')[0]}
                                </p>

                                {/* Stats Section */}
                                <div className="flex gap-12 justify-center md:justify-start bg-gray-50/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 inline-flex">
                                    <div className="flex flex-col items-center md:items-start cursor-pointer group" onClick={() => toggleModal('following')}>
                                        <span className="text-2xl font-black text-gray-900 tabular-nums">{userByIdProfile.following.length}</span>
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Following</span>
                                    </div>
                                    <div className="h-10 w-[1px] bg-gray-200 self-center"></div>
                                    <div className="flex flex-col items-center md:items-start cursor-pointer group" onClick={() => toggleModal('followers')}>
                                        <span className="text-2xl font-black text-gray-900 tabular-nums">{userByIdProfile.followers.length}</span>
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Followers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts Grid Placeholder or Section */}
                    <div className="mt-16">
                        <div className="flex items-center justify-center gap-12 mb-10 border-b border-gray-200">
                            <button className="pb-4 text-sm font-bold text-gray-900 border-b-2 border-gray-900 flex items-center gap-2">
                                <i className="fa fa-th"></i> POSTS
                            </button>
                            <button className="pb-4 text-sm font-bold text-gray-400 hover:text-gray-600 flex items-center gap-2 transition-colors">
                                <i className="fa fa-bookmark-o"></i> SAVED
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Empty State as Placeholder */}
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                                    <i className="fa fa-camera text-3xl"></i>
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-2">No Posts Yet</h3>
                                <p className="text-gray-500 max-w-xs">When you share photos, they will appear here on your profile.</p>
                            </div>
                        </div>
                    </div>

                    {/* Modal */}
                    {(modalType === 'following' || modalType === 'followers') && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => toggleModal(null)}></div>
                            <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                                <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                        {modalType === "following" ? "Following" : "Followers"}
                                    </h2>
                                    <button 
                                        onClick={() => toggleModal(null)} 
                                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-full transition-colors text-gray-400"
                                    >
                                        <i className="fa fa-times text-xl"></i>
                                    </button>
                                </div>
                                <div className="overflow-y-auto max-h-[60vh] p-4 space-y-2">
                                    {(modalType === 'following' ? userByIdProfile.following : userByIdProfile.followers).map((item) => (
                                        <div className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-3xl transition-all group" key={item._id}>
                                            <Link to={`/profile/${item._id}`} className="flex items-center gap-4 flex-1">
                                                <div className="relative">
                                                    <img className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-gray-100" src={item?.userimage?.url} alt={item.username} />
                                                    <div className="absolute inset-0 rounded-full bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors"></div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.username}</div>
                                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">@{item.email.split('@')[0]}</div>
                                                </div>
                                            </Link>
                                            <button
                                                className={`py-2 px-6 rounded-full text-xs font-bold transition-all active:scale-95 ${
                                                    user.following.includes(item._id) 
                                                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    const action = user.following.includes(item._id) ? UnFollow : Follow;
                                                    try {
                                                        await dispatch(action(item._id));
                                                    } catch (error) {
                                                        alert(error.message);
                                                    }
                                                }}
                                            >
                                                {user.following.includes(item._id) ? "Unfollow" : "Follow"}
                                            </button>
                                        </div>
                                    ))}
                                    {(modalType === 'following' ? userByIdProfile.following : userByIdProfile.followers).length === 0 && (
                                        <div className="text-center py-16">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                                <i className="fa fa-users text-2xl"></i>
                                            </div>
                                            <p className="text-gray-400 font-medium italic">No {modalType} to show.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Profile;


