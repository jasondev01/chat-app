const chatModel = require("../Models/chatModel")

// create chat
// find user chats
// find chat

const createChat = async (req, res) => {
    // extract two ids from the body
    const { firstId, secondId } = req.body;
    try {
        const chat = await chatModel.findOne({
            members: { $all: [ firstId, secondId ] }
        });
        if (chat) return res.status(200).json(chat); // if chat already exist we dont need to create one
        // create a new chat
        const newChat = new chatModel({
            members: [ firstId, secondId ]
        });
        const response = await newChat.save();
        res.status(200).json(response)
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const findUserChats = async (req, res) => {
    const userId = req.params.userId // get the user id from user id on parameter
    try {
        const chats = await chatModel.find({
            members: { $in: [ userId ] },
        });
        res.status(200).json(chats)
    } catch(error) {
        console.log(error)
        res.status(500).json(error);
    }
};

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params // get the user's id
    try {
        const chat = await chatModel.findOne({
            members: { $all: [ firstId, secondId ] },
        });
        res.status(200).json(chat)
    } catch(error) {
        console.log(error)
        res.status(500).json(error);
    }
}

module.exports = { createChat, findUserChats, findChat };

