import express from 'express';
import { commentModel } from '../Models/Comment.js';
import { PostModel } from '../Models/Post.js';
import { authenticateToken } from '../Utils/Authentication.js';

const CommentRouter = express.Router();


CommentRouter.post('/postcomment', authenticateToken, async (req, res) => {
    try {
        const { commentText, postId } = req.body;
        const userId = req.user.id;

        const newComment = new commentModel({
            commentText,
            userId,
            postId
        });

        await newComment.save();
        await PostModel.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment._id } },

        );
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error creating comment:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

CommentRouter.delete('/postcomment/:id', authenticateToken, async (req, res) => {
    const commentId = req.params.id;
    const userId = req.user.id;


    try {
        const comment = await commentModel.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Unauthorized to delete this comment' });
        }

        await commentModel.findByIdAndDelete(commentId);
        await PostModel.findByIdAndUpdate(
            comment.postId,
            { $pull: { comments: commentId } }
        );

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting comment:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


CommentRouter.get('/getcomment/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await commentModel.find({ postId: id }).populate('userId', 'username userimage');
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});






export default CommentRouter;
