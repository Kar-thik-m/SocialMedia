import express from 'express';
import { Messages } from '../Models/MessageModel.js';
import { Conversation } from '../Models/ConversationModel.js';
import { usermodel } from '../Models/User.js';
import { authenticateToken } from '../Utils/Authentication.js';


const MessageRouter = express.Router();

MessageRouter.post('/sendMessage/:id', authenticateToken, async (req, res) => {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    if (!message) {
        return res.status(400).json({ error: "Message content is required." });
    }

    try {
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });

            const sender = await usermodel.findById(senderId);
            const receiver = await usermodel.findById(receiverId);

            if (sender && receiver) {
                const isSenderContact = sender.contacts.includes(receiverId);
                const isReceiverContact = receiver.contacts.includes(senderId);

                if (!isSenderContact) {
                    sender.contacts.push(receiverId);
                }
                if (!isReceiverContact) {
                    receiver.contacts.push(senderId);
                }

                await Promise.all([sender.save(), receiver.save()]);
            }
        }

        const newMessage = new Messages({
            senderId,
            receiverId,
            message,
        });

        conversation.messages.push(newMessage._id);
        await Promise.all([conversation.save(), newMessage.save()]);

       

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

MessageRouter.get('/getMessage/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const senderId = req.user.id;

    try {
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, id] },
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.messages);
    } catch (error) {
        console.error("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default MessageRouter;
