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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {userByIdProfile && user && (
                <div className="max-w-4xl mx-auto px-4 pt-10">
                    <div className="flex flex-col items-center bg-white rounded-3xl p-10 shadow-sm border border-gray-100">
                        <div className="relative group">
                            <img className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300" src={userByIdProfile?.userimage?.url} alt="Profile" />
                            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        </div>
                        
                        <h1 className="text-4xl font-extrabold text-gray-900 mt-6 tracking-tight">{userByIdProfile.username}</h1>
                        <p className="text-gray-500 text-lg mt-1">{userByIdProfile.email.split('@')[0]}</p>
                        
                        <div className="flex gap-8 my-8">
                            <div className="flex flex-col items-center cursor-pointer group" onClick={() => toggleModal('following')}>
                                <span className="text-xl font-bold text-gray-900">{userByIdProfile.following.length}</span>
                                <span className="text-gray-500 font-medium group-hover:text-blue-600 transition-colors">Following</span>
                            </div>
                            <div className="flex flex-col items-center cursor-pointer group" onClick={() => toggleModal('followers')}>
                                <span className="text-xl font-bold text-gray-900">{userByIdProfile.followers.length}</span>
                                <span className="text-gray-500 font-medium group-hover:text-blue-600 transition-colors">Followers</span>
                            </div>
                        </div>

                        <div className="flex gap-4 w-full max-w-xs">
                            {user._id === userByIdProfile._id ? (
                                <Link className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-xl font-bold text-center hover:bg-black transition-all shadow-md hover:shadow-lg active:scale-95" to={`/editprofile/${user._id}`}>
                                    Edit Profile
                                </Link>
                            ) : (
                                <>
                                    <button 
                                        onClick={handleFollowToggle} 
                                        className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 ${
                                            isFollowing 
                                            ? "bg-gray-100 text-gray-900 hover:bg-gray-200" 
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                        }`}
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </button>
                                    <Link 
                                        className="flex-1 bg-gray-100 text-gray-900 py-3 px-6 rounded-xl font-bold text-center hover:bg-gray-200 transition-all shadow-md active:scale-95 border border-gray-200" 
                                        to={`/inbox/${id}`}
                                    >
                                        Message
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Modal */}
                    {(modalType === 'following' || modalType === 'followers') && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => toggleModal(null)}></div>
                            <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {modalType === "following" ? "Following" : "Followers"}
                                    </h2>
                                    <button 
                                        onClick={() => toggleModal(null)} 
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="overflow-y-auto max-h-[60vh] p-4">
                                    {(modalType === 'following' ? userByIdProfile.following : userByIdProfile.followers).map((item) => (
                                        <div className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors" key={item._id}>
                                            <Link to={`/profile/${item._id}`} className="flex items-center gap-4 flex-1">
                                                <img className="w-12 h-12 rounded-full object-cover border border-gray-100" src={item?.userimage?.url} alt={item.username} />
                                                <div>
                                                    <div className="font-bold text-gray-900">{item.username}</div>
                                                    <div className="text-sm text-gray-500">@{item.email.split('@')[0]}</div>
                                                </div>
                                            </Link>
                                            <button
                                                className={`py-2 px-5 rounded-full text-sm font-bold transition-all ${
                                                    user.following.includes(item._id) 
                                                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200" 
                                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    const action = user.following.includes(item._id) ? UnFollow : Follow;
                                                    try {
                                                        await dispatch(action(item._id));
                                                        // Note: We should probably update the local state properly via redux
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
                                        <div className="text-center py-10 text-gray-500">
                                            No {modalType} yet.
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

