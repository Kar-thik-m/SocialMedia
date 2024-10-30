
import express from 'express';
import { usermodel } from '../Models/User.js';
import bcrypt from "bcrypt"
import uploadFile from '../Utils/MulterAccess.js';
import getUrl from '../Utils/UrlGenerate.js';
import cloudinary from "cloudinary"
import { sendToken } from '../Utils/GetTokenAcess.js';
import { authenticateToken } from '../Utils/Authentication.js';
const userRouter = express.Router();



userRouter.post('/register', uploadFile, async (req, res) => {
    try {
        const payload = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileurl = getUrl(file);
        const cloud = await cloudinary.v2.uploader.upload(fileurl.content);

        const userCheck = await usermodel.findOne({ email: payload.email });
        if (userCheck) {
            return res.status(409).json({ message: "User already exists" });
        }


        const hash = await bcrypt.hash(payload.password, 10);

        const userdata = new usermodel({
            ...payload,
            password: hash,
            userimage: { id: cloud.public_id, url: cloud.secure_url }
        });

        await userdata.save();

        sendToken(userdata, 201, res);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error registering user details' });
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;


        const existingUser = await usermodel.findOne({ email });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }


        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password" });
        }


        sendToken(existingUser, 200, res);

    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: "Error in logging in" });
    }
});

userRouter.get('/loaduser', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {

        const userProfile = await usermodel.findById(userId)
            .select('-password')
            .populate('followers', 'username userimage')
            .populate('following', 'username userimage')
            .populate('posts')
            .populate('contacts', 'username userimage')

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


userRouter.get('/profile/:id', authenticateToken, async (req, res) => {
    const userId = req.params.id;

    try {

        const userProfile = await usermodel.findById(userId)
            .select('-password')
            .populate('followers', 'username userimage')
            .populate('following', 'username userimage')
            .populate('posts')
            .populate('contacts', 'username userimage')

        if (!userProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(userProfile);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



userRouter.post('/follow/:id', authenticateToken, async (req, res) => {
    const userIdToFollow = req.params.id;
    const currentUserId = req.user.id;

    try {

        const currentUser = await usermodel.findById(currentUserId);
        if (currentUser.following.includes(userIdToFollow)) {
            return res.status(400).json({ message: 'You are already following this user.' });
        }

        await usermodel.findByIdAndUpdate(
            currentUserId,
            { $push: { following: userIdToFollow } }
        );

        await usermodel.findByIdAndUpdate(
            userIdToFollow,
            { $push: { followers: currentUserId } }
        );

        res.status(200).json({ message: 'Successfully followed the user.' });
    } catch (error) {
        console.error('Error following user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


userRouter.post('/unfollow/:id', authenticateToken, async (req, res) => {
    const userIdToUnfollow = req.params.id;
    const currentUserId = req.user.id;

    try {

        const currentUser = await usermodel.findById(currentUserId);
        if (!currentUser.following.includes(userIdToUnfollow)) {
            return res.status(400).json({ message: 'You are not following this user.' });
        }

        await usermodel.findByIdAndUpdate(
            currentUserId,
            { $pull: { following: userIdToUnfollow } }
        );

        await usermodel.findByIdAndUpdate(
            userIdToUnfollow,
            { $pull: { followers: currentUserId } }
        );

        res.status(200).json({ message: 'Successfully unfollowed the user.' });
    } catch (error) {
        console.error('Error unfollowing user:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});


userRouter.put('/updateprofile/:id', authenticateToken, uploadFile, async (req, res) => {
    const userId = req.params.id;

    try {
        const existingUser = await usermodel.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { username } = req.body;
        if (username) {
            existingUser.username = username;
        }

        if (req.file) {
            const fileurl = getUrl(req.file);
            const uploadResult = await cloudinary.v2.uploader.upload(fileurl.content);

            if (existingUser.userimage && existingUser.userimage.id) {
                await cloudinary.v2.uploader.destroy(existingUser.userimage.id);
            }

            existingUser.userimage = { id: uploadResult.public_id, url: uploadResult.secure_url };
        }

        const updatedUser = await existingUser.save();
        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(400).json({ message: error.message });
    }
});


export default userRouter