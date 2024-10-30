import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    userimage: {
        id: String,
        url: String,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ email: this.email }, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRES
    })
}

export const usermodel = mongoose.model('User', userSchema);
