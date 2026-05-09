import React, { useEffect, useState } from "react";
import { GetPostAll, PostUnlike, PostLike } from "../../Redux/Action/postAction.js";
import { useDispatch, useSelector } from "react-redux";
import Comment from "../Comments/Comment.jsx";
import { useAuth } from "../../contextApi/AuthContext";
import { Link } from "react-router-dom";

const GetPost = () => {
    const { getallposts, loading, error } = useSelector((state) => state.post);
    const dispatch = useDispatch();
    const { user } = useAuth();

    const [likedPosts, setLikedPosts] = useState({});
    const [likesCount, setLikesCount] = useState({});
    const [commentsVisible, setCommentsVisible] = useState({});

    useEffect(() => {
        dispatch(GetPostAll());
    }, [dispatch]);

    useEffect(() => {
        if (getallposts) {
            const initialLikes = {};
            const initialLikesCount = {};
            const initialCommentsVisible = {};
            getallposts.forEach(post => {
                initialLikes[post._id] = post.likes && post.likes.some(like => like._id === user?._id);
                initialLikesCount[post._id] = post.likes ? post.likes.length : 0;
                initialCommentsVisible[post._id] = false;
            });
            setLikedPosts(initialLikes);
            setLikesCount(initialLikesCount);
            setCommentsVisible(initialCommentsVisible);
        }
    }, [getallposts, user]);

    if (!user) {
        return <div className="text-red-500 font-bold m-5 text-center">User not authenticated.</div>;
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 font-bold m-5 text-center">Error: {error}</div>;
    }

    const handleLikeToggle = (postId) => {
        const isLiked = likedPosts[postId];
        if (isLiked) {
            dispatch(PostUnlike(postId)).then(() => {
                setLikedPosts(prev => ({ ...prev, [postId]: false }));
                setLikesCount(prev => ({ ...prev, [postId]: (prev[postId] || 1) - 1 }));
            });
        } else {
            dispatch(PostLike(postId)).then(() => {
                setLikedPosts(prev => ({ ...prev, [postId]: true }));
                setLikesCount(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
            });
        }
    };

    const toggleComments = (postId) => {
        setCommentsVisible(prev => ({ ...prev, [postId]: !prev[postId] }));
    };

    return (
        <div className="flex flex-col items-center w-full max-w-[600px] mx-auto p-4 gap-8">
            {getallposts && getallposts.length > 0 ? (
                getallposts.map((post) => (
                    <div key={post._id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden w-full transition-all hover:shadow-md">
                        <div className="flex items-center p-4">
                            <Link to={`/profile/${post?.userId?._id}`} className="shrink-0">
                                <img
                                    src={post.userId.userimage?.url}
                                    alt={post.userId.username}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-gray-100"
                                />
                            </Link>
                            <div className="ml-3">
                                <span className="font-bold text-gray-900 block hover:text-blue-600 transition-colors">
                                    {post.userId.username}
                                </span>
                                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                                    {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        
                        <div className="relative group">
                            <img src={post.image?.url} alt={post.title} className="w-full h-auto block" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none"></div>
                        </div>

                        <div className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => handleLikeToggle(post._id)}
                                        className="transition-transform active:scale-125 duration-200"
                                    >
                                        {likedPosts[post._id] ? (
                                            <i className="fa fa-heart text-2xl text-red-500 drop-shadow-sm" aria-hidden="true"></i>
                                        ) : (
                                            <i className="fa fa-heart-o text-2xl text-gray-400 hover:text-red-400" aria-hidden="true"></i>
                                        )}
                                    </button>
                                    <span className="font-bold text-gray-800 ml-1">
                                        {likesCount[post._id] || 0} likes
                                    </span>
                                </div>
                                <button 
                                    className="text-sm font-bold text-blue-500 bg-blue-50 py-2 px-4 rounded-full hover:bg-blue-100 transition-colors" 
                                    onClick={() => toggleComments(post._id)}
                                >
                                    {commentsVisible[post._id] ? "Hide Comments" : "View Comments"}
                                </button>
                            </div>
                            
                            <div className="mt-3">
                                <p className="text-gray-800 leading-relaxed">
                                    <span className="font-bold mr-2">{post.userId.username}</span>
                                    {post.title}
                                </p>
                            </div>
                        </div>

                        {commentsVisible[post._id] && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                                <Comment postId={post._id} toggleComments={() => toggleComments(post._id)} />
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="py-20 text-center text-gray-400 font-medium">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    No posts available in your feed.
                </div>
            )}
        </div>
    );
};

export default GetPost;

