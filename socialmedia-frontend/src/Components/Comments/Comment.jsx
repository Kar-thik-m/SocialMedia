import React, { useEffect, useState } from "react";
import CommentStyle from "../Comments/Comment.module.css";
import { useSelector, useDispatch } from "react-redux";
import { GetAllComments, AddCommentsPost, DeleteCommentPost } from "../../Redux/Action/CommentAction";
import { formatTimeAgo } from "../../Utils/GenerateTime";
import { useAuth } from "../../contextApi/AuthContext";

const Comment = ({ postId, toggleComments }) => {
    const [newComment, setNewComment] = useState("");
    const { user } = useAuth();
    const dispatch = useDispatch();
    const { getallposts } = useSelector((state) => state.post);
    const { comments } = useSelector((state) => state.comment);
    const [loadingState, setLoadingState] = useState({
        comment: false,
        delete: false,
    });
    console.log(user?.user?._id)
    const post = getallposts.find(post => post._id === postId);

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
            setLoadingState(prev => ({ ...prev, delte: true }));
            await dispatch(DeleteCommentPost(commentId));

        } catch (error) {
            alert("Error Dlele comment: " + error.message);
        } finally {
            setLoadingState(prev => ({ ...prev, delete: false }));
        }
    }
    return (
        <div className={CommentStyle.commentSection}>
            <h2 onClick={toggleComments} style={{ cursor: 'pointer' }}>Close</h2>
            <div className={CommentStyle.commentsList}>
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className={CommentStyle.commentcontainer}>
                            <div className={CommentStyle.commentItem}>
                                <img
                                    src={comment.userId.userimage?.url || "https://freerangestock.com/sample/120147/business-man-profile-vector.jpg"}
                                    alt={comment.userId.username}
                                    className={CommentStyle.userImage}
                                />
                                <strong>{comment.userId.username}: </strong>
                            </div>
                            <div className={CommentStyle.commentstext}>
                                {comment.commentText}
                            </div>
                            <div className={CommentStyle.commentDate}>
                                <div>{formatTimeAgo(comment.createdAt)}</div>
                                {comment.userId?._id == user?._id ? (<i
                                    style={{ cursor: "pointer", color: "red" }}
                                    className="fa fa-ban"
                                    aria-hidden="true"
                                    onClick={() => HandleDeleteComment(comment?._id)}
                                ></i>) : ""}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No comments yet.</div>
                )}
            </div>
            <div className={CommentStyle.inputContainer}>
                <input
                    type="text"
                    value={newComment}
                    onChange={handleInputChange}
                    placeholder="Add a comment..."
                    className={CommentStyle.commentTextarea}
                />
                <button className={CommentStyle.commentButton} onClick={handleAddComment}>
                    {loadingState.comment ? "Adding..." : "Add Comment"}
                </button>
            </div>
        </div>
    );
};

export default Comment;
