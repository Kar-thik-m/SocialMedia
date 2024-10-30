import React, { useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import inboxStyle from "../Inbox/Inbox.module.css";
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
        <div className={inboxStyle.inboxContainer}>
            <div className={inboxStyle.sidebar}>
                {userByIdProfile?.contacts?.map((contact) => (
                    <div
                        key={contact._id}
                        className={inboxStyle.contactItem}
                        onClick={() => handleClickContact(contact._id)}
                    >
                        <img
                            src={contact?.userimage?.url}
                            alt={contact?.username}
                            className={inboxStyle.contactImage}
                        />
                        <span className={inboxStyle.contactUsername}>{contact.username}</span>
                    </div>
                ))}
            </div>
            <div className={inboxStyle.message}>
                <Chat contact={contact} />
            </div>
        </div>
    );
};

export default Inbox;
