import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { postMessage, getMessages } from '../../Redux/Action/MessageAction';
import { useAuth } from '../../contextApi/AuthContext';

const Chat = ({ contact }) => {
    const { id: receiverId } = useParams();
    const dispatch = useDispatch();
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isSending, setIsSending] = useState(false);
    
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
        <div className="p-5 max-w-[600px] mx-auto border border-gray-300 rounded-xl bg-white shadow-sm h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-5 font-mono font-bold border-b pb-3">
                <div className="text-lg">{contact?.username}</div>
                <Link to={`/profile/${receiverId}`}>
                    <img src={contact?.userimage.url} className="rounded-full w-12 h-12 object-cover border-2 border-blue-500 p-0.5" alt={`${contact?.username}'s avatar`} />
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto mb-4 scrollbar-hide">
                <div className="flex flex-col gap-2">
                    {messages.map((msg, index) => (
                        <div
                            key={msg._id || index} 
                            className={`p-3 rounded-2xl max-w-[80%] break-words ${
                                msg.senderId === user?._id 
                                ? "bg-green-600 text-white self-end rounded-tr-none" 
                                : "bg-gray-100 text-gray-800 self-start rounded-tl-none"
                            }`}
                        >
                            {msg.content}
                        </div>
                    ))}
                </div>
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    required
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button 
                    type="submit" 
                    disabled={isSending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;

