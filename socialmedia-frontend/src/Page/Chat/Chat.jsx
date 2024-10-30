import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { postMessage, getMessages } from '../../Redux/Action/MessageAction';
import ChatStyle from "../Chat/Chat.module.css";
import { useAuth } from '../../contextApi/AuthContext';

const Chat = ({ contact }) => {
    const { id: receiverId } = useParams();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);
    useEffect(() => {

        dispatch(getMessages(receiverId));


        const newSocket = io('https://socialmedia-nhb5.onrender.com/', {
            transports: ['websocket'],
        });

        newSocket.on("connect", () => {
            if (user?._id) {
                newSocket.emit("addUser", user._id);
            }
        });

        newSocket.on("getUsers", (onlineUsers) => {
            dispatch(setOnlineUsers(onlineUsers));
        });

        newSocket.on("message", (msg) => {

            setMessages((prevMessages) => {
                if (!prevMessages.some(m => m._id === msg._id)) {
                    return [...prevMessages, msg];
                }
                return prevMessages;
            });
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user?._id, receiverId, dispatch]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() && socket && !isSending) {
            setIsSending(true);
            const messageToSend = {
                senderId: user._id,
                receiverId,
                content: input,
            };

            socket.emit('sendMessage', messageToSend);
            setMessages((prevMessages) => [...prevMessages, messageToSend]);
            setInput('');
            await dispatch(postMessage(receiverId, input));
            setIsSending(false);
        }
    };

    return (
        <div className={ChatStyle.chatContainer}>
            <div className={ChatStyle.othernames}>
                <div>{contact?.username}</div>
                <Link to={`/profile/${receiverId}`}>
                    <img src={contact?.userimage.url} className={ChatStyle.otherimage} alt={`${contact?.username}'s avatar`} />
                </Link>
            </div>
            <div>
                <ul className={ChatStyle.messageList}>
                    {messages.map((msg, index) => (

                        <div
                            key={msg._id || index} className={msg.senderId === user?._id ? ChatStyle.messageRight : ChatStyle.messageLeft}
>
                            {msg.content}
                        </div>

                    ))}
                </ul>
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message"
                    required
                />
                <button type="submit" disabled={isSending}>Send</button> {/* Disable button while sending */}
            </form>
        </div>
    );
};

export default Chat;
