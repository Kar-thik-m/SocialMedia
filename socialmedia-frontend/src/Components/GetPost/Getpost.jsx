import React, { useEffect, useState } from "react";
import { GetPostAll, PostLike, PostUnlike } from "../../Redux/Action/PostAction.js"; 
import { useDispatch, useSelector } from "react-redux";
import getpoststyles from './GetPost.module.css';
import Comment from "../Comments/Comment";
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
                initialLikes[post._id] = post.likes && post.likes.some(like => like._id === user._id);
                initialLikesCount[post._id] = post.likes ? post.likes.length : 0;
                initialCommentsVisible[post._id] = false;
            });
            setLikedPosts(initialLikes);
            setLikesCount(initialLikesCount);
            setCommentsVisible(initialCommentsVisible);
        }
    }, [getallposts, user]);

    if (!user) {
        return <div className={getpoststyles.error}>User not authenticated.</div>;
    }

    if (loading) {
        return <div className={getpoststyles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={getpoststyles.error}>Error: {error}</div>;
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
        <div className={getpoststyles.container}>
            {getallposts && getallposts.length > 0 ? (
                getallposts.map((post) => (
                    <div key={post._id} className={getpoststyles.post}>
                        <div className={getpoststyles.header}>
                            <Link to={`/profile/${post?.userId?._id}`}>
                                <img
                                    src={post.userId.userimage?.url}
                                    alt={post.userId.username}
                                    className={getpoststyles.userImage}
                                />
                            </Link>
                            <span className={getpoststyles.username}>{post.userId.username}</span>
                            <p className={getpoststyles.createdAt}>
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <img src={post.image?.url} alt={post.title} className={getpoststyles.postImage} />
                        <div className={getpoststyles.likesandcomment}>
                            <span className={getpoststyles.likesandlikes}>
                                {likesCount[post._id] || 0}
                                <div onClick={() => handleLikeToggle(post._id)}>
                                    {likedPosts[post._id] ? (
                                        <i className="fa fa-heart" aria-hidden="true"></i>
                                    ) : (
                                        <i className="fa fa-heart-o" aria-hidden="true"></i>
                                    )}
                                </div>
                            </span>
                            <div className={getpoststyles.comments} onClick={() => toggleComments(post._id)}>
                                Add Comment
                            </div>
                        </div>
                        {commentsVisible[post._id] && (
                            <div className={getpoststyles.setcomments}>
                                <Comment postId={post._id} toggleComments={() => toggleComments(post._id)} />
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div>No posts available.</div>
            )}
        </div>
    );
};

export default GetPost;
