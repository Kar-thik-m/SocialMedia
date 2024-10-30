import express from 'express';
import { PostModel } from '../Models/Post.js';
import { usermodel } from '../Models/User.js';
import { authenticateToken } from '../Utils/Authentication.js';
import getUrl from '../Utils/UrlGenerate.js';
import cloudinary from "cloudinary"
import uploadFile from '../Utils/MulterAccess.js';

const Postrouter = express.Router();

Postrouter.post('/itempost', uploadFile, authenticateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        const file = req.file;


        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileurl = getUrl(file);

        const cloud = await cloudinary.v2.uploader.upload(fileurl.content);
        const userId = req.user.id;

        const newPost = new PostModel({
            title,
            image: { id: cloud.public_id, url: cloud.secure_url },
            userId,
            content
        });
        await newPost.save();
        await usermodel.findByIdAndUpdate(
            userId,
            { $push: { posts: newPost._id } },

        );
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

Postrouter.get('/getitemposts', authenticateToken, async (req, res) => {
    try {
        const posts = await PostModel.find()
            .populate('userId', 'username userimage')
            .populate('likes', 'username')
            .populate('comments');

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


Postrouter.post('/itempost/like/:id', authenticateToken, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        if (post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You already liked this post.' });
        }


        post.likes.push(userId);
        await post.save();

        res.status(200).json({ message: 'Post liked successfully', post });
    } catch (error) {
        console.error('Error liking post:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


Postrouter.delete('/itempost/unlike/:id', authenticateToken, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have not liked this post.' });
        }


        post.likes.pull(userId);
        await post.save();

        res.status(200).json({ message: 'Post unliked successfully', post });
    } catch (error) {
        console.error('Error unliking post:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

Postrouter.delete('/itempost/:id', authenticateToken, async (req, res) => {
    const postId = req.params.id;
    const userId = req.user.id;

    try {
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }


        await PostModel.findByIdAndDelete(postId);


        await usermodel.findByIdAndUpdate(userId, { $pull: { posts: postId } });

      
        if (post.image.id) {
            await cloudinary.v2.uploader.destroy(post.image.id);
        }

        res.status(204).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



export default Postrouter;