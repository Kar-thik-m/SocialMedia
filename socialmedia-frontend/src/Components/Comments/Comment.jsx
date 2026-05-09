import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetAllComments, AddCommentsPost, DeleteCommentPost } from "../../Redux/Action/CommentAction";
import { formatTimeAgo } from "../../Utils/GenerateTime";
import { useAuth } from "../../contextApi/AuthContext";

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
            alert("Comment cannot be empty!");
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
        <div className="flex flex-col w-full animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Comments ({comments?.length || 0})</h3>
                <button 
                    onClick={toggleComments} 
                    className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase tracking-widest"
                >
                    Close
                </button>
            </div>

            <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex flex-col group">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={comment.userId.userimage?.url || "https://freerangestock.com/sample/120147/business-man-profile-vector.jpg"}
                                        alt={comment.userId.username}
                                        className="w-8 h-8 rounded-full object-cover border border-gray-100"
                                    />
                                    <span className="text-xs font-bold text-gray-900">{comment.userId.username}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{formatTimeAgo(comment.createdAt)}</span>
                                    {comment.userId?._id === user?._id && (
                                        <button 
                                            onClick={() => HandleDeleteComment(comment?._id)}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-600 transition-all"
                                            title="Delete comment"
                                        >
                                            <i className="fa fa-trash-o" aria-hidden="true"></i>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="pl-10 -mt-1">
                                <p className="text-sm text-gray-700 leading-relaxed break-words">{comment.commentText}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center text-gray-400 text-sm font-medium">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 p-1.5 border border-gray-200 rounded-2xl bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                <input
                    type="text"
                    value={newComment}
                    onChange={handleInputChange}
                    placeholder="Write a comment..."
                    className="flex-1 border-none rounded-xl px-3 py-2 text-sm outline-none bg-transparent placeholder-gray-400"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button 
                    className="bg-blue-600 text-white border-none rounded-xl py-2 px-6 text-xs font-bold cursor-pointer hover:bg-blue-700 transition-all shadow-md active:scale-95 disabled:bg-gray-300" 
                    onClick={handleAddComment}
                    disabled={loadingState.comment || !newComment.trim()}
                >
                    {loadingState.comment ? "..." : "Post"}
                </button>
            </div>
        </div>
    );
};

export default Comment;

