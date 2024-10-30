
import { configureStore } from '@reduxjs/toolkit';
import PostReducer from '../Slice/PostSlice.js';
import CommentReducer from "../Slice/CommentSlice.js"
import ProfileReducer from "../Slice/UserProfileSlice.js"
import MessageRouter from "../Slice/MessageSlice.js"

const store = configureStore({
    devTools: true,
    reducer: {
        post: PostReducer,
        comment: CommentReducer,
        profile: ProfileReducer,
        message: MessageRouter,
       
    },
});

export default store;