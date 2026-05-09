import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllComments, AddCommentsPost, DeleteCommentPost } from "../../Redux/Action/CommentAction";
import { formatTimeAgo } from "../../Utils/GenerateTime";
import { useAuth } from "../../contextApi/AuthContext";
import { Link } from "react-router-dom";

const Comment = ({ postId, toggleComments }) => {
    const [newComment, setNewComment] = useState("");
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { comments } = useSelector((state) => state.comment);
    const [loadingState, setLoadingState] = useState({
        comment: false,
        delete: false,
    });

    useEffect(() => {
        if (postId) {
            dispatch(GetAllComments(postId));
        }
    }, [dispatch, postId]);

    const handleInputChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleAddComment = async () => {
        if (newComment.trim() === "") {
            return;
        }
        try {
            setLoadingState(prev => ({ ...prev, comment: true }));
            await dispatch(AddCommentsPost(newComment, postId, user));
            setNewComment("");
        } catch (error) {
            alert("Error adding comment: " + error.message);
        } finally {
            setLoadingState(prev => ({ ...prev, comment: false }));
        }
    };

    const HandleDeleteComment = async (commentId) => {
        try {
            setLoadingState(prev => ({ ...prev, delete: true }));
            await dispatch(DeleteCommentPost(commentId));
        } catch (error) {
            alert("Error deleting comment: " + error.message);
        } finally {
            setLoadingState(prev => ({ ...prev, delete: false }));
        }
    }

    return (
        <div className="flex flex-col w-full animate-in fade-in slide-in-from-top-4 duration-500 pt-6 border-t border-gray-50 mt-6">
            <div className="flex justify-between items-center mb-8 px-1">
                <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">Discussion ({comments?.length || 0})</h3>
                </div>
                <button 
                    onClick={toggleComments} 
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all duration-300"
                    title="Close discussion"
                >
                    <i className="fa fa-times text-sm"></i>
                </button>
            </div>

            <div className="flex flex-col gap-8 max-h-[50vh] overflow-y-auto mb-8 pr-4 scrollbar-thin scrollbar-thumb-gray-100 hover:scrollbar-thumb-gray-200 transition-colors">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4 group animate-in fade-in slide-in-from-left-2 duration-300">
                            <Link to={`/profile/${comment.userId._id}`} className="shrink-0">
                                <img
                                    src={comment.userId.userimage?.url || "https://via.placeholder.com/150"}
                                    alt={comment.userId.username}
                                    className="w-10 h-10 rounded-2xl object-cover shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 transition-all"
                                />
                            </Link>
                            <div className="flex-1 flex flex-col gap-1.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Link to={`/profile/${comment.userId._id}`} className="text-sm font-black text-gray-900 hover:text-blue-600 transition-colors">{comment.userId.username}</Link>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{formatTimeAgo(comment.createdAt)}</span>
                                    </div>
                                    {comment.userId?._id === user?._id && (
                                        <button 
                                            onClick={() => HandleDeleteComment(comment?._id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90"
                                            title="Delete comment"
                                        >
                                            <i className="fa fa-trash-o text-sm"></i>
                                        </button>
                                    )}
                                </div>
                                <div className="bg-gray-50/50 rounded-2xl rounded-tl-none p-4 border border-gray-100/50 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                                    <p className="text-sm text-gray-600 leading-relaxed break-words font-medium">{comment.commentText}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                            <i className="fa fa-comments-o text-3xl"></i>
                        </div>
                        <h4 className="text-gray-900 font-bold mb-1">No comments yet</h4>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Be the first to share your thoughts!</p>
                    </div>
                )}
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[28px] blur opacity-0 group-focus-within:opacity-10 transition duration-500"></div>
                <div className="relative flex items-center gap-3 p-2 border-2 border-gray-100 rounded-[24px] bg-white shadow-sm focus-within:border-blue-500/50 focus-within:shadow-lg focus-within:shadow-blue-500/5 transition-all duration-300">
                    <div className="pl-3 shrink-0">
                        <img 
                            src={user?.userimage?.url || 'https://via.placeholder.com/150'} 
                            className="w-8 h-8 rounded-xl object-cover ring-2 ring-gray-50 shadow-sm"
                            alt="Your avatar"
                        />
                    </div>
                    <input
                        type="text"
                        value={newComment}
                        onChange={handleInputChange}
                        placeholder="Add to the discussion..."
                        className="flex-1 border-none px-1 py-3 text-sm font-medium outline-none bg-transparent placeholder-gray-400 text-gray-900"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button 
                        className="bg-blue-600 text-white border-none rounded-[18px] h-10 px-6 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none" 
                        onClick={handleAddComment}
                        disabled={loadingState.comment || !newComment.trim()}
                    >
                        {loadingState.comment ? "..." : "Send"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Comment;


