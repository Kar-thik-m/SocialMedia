import React, { useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import { useNavigate, useParams } from "react-router-dom";
import { GetProfileByUser } from "../../Redux/Action/ProfileAction";
import { useAuth } from "../../contextApi/AuthContext";
import { useDispatch, useSelector } from "react-redux";

const Inbox = () => {
    const { user } = useAuth();
    const [contact, setContact] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userByIdProfile } = useSelector((state) => state.profile);

    useEffect(() => {
        if (user?._id) {
            dispatch(GetProfileByUser(user._id));
        }
    }, [dispatch, user?._id]);

    useEffect(() => {
        if (id && userByIdProfile) {
            const selectedContact = userByIdProfile.contacts.find(contact => contact._id === id);
            setContact(selectedContact);
        }
    }, [id, userByIdProfile]);

    const handleClickContact = (contactId) => {
        navigate(`/inbox/${contactId}`);
    };

    return (
        <div className="flex h-[calc(100vh-64px)] bg-gray-50">
            {/* Sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {userByIdProfile?.contacts?.length > 0 ? (
                        userByIdProfile.contacts.map((contactItem) => (
                            <div
                                key={contactItem._id}
                                className={`flex items-center p-4 cursor-pointer transition-all duration-200 border-b border-gray-50 hover:bg-blue-50 ${id === contactItem._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                                onClick={() => handleClickContact(contactItem._id)}
                            >
                                <div className="relative">
                                    <img
                                        src={contactItem?.userimage?.url}
                                        alt={contactItem?.username}
                                        className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="ml-4 flex-1">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-900 truncate">{contactItem.username}</span>
                                        <span className="text-xs text-gray-400">12:45 PM</span>
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">Hey, how are you doing today?</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <p>No contacts found</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                {id ? (
                    <Chat contact={contact} />
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium">Your Messages</h3>
                        <p className="mt-2">Select a contact to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;

