const Conversation = require("./src/models/conversation");
const Message = require("./src/models/message");

const resolvers = {
  newMessage: async ({ conversationId, sender, text }) => {
    const { members } = await Conversation.findById(conversationId);
    const data = { conversationId, sender, text, members };
    const newMessage = new Message(data);
    await newMessage.save();
    return newMessage;
  },
  getMessage: async ({ conversationId }) => {
    const messages = await Message.find({
      conversationId,
    });
    return messages;
  },
  createConversation: async ({ senderId, receiverId }) => {
    const newConversation = new Conversation({
      members: [senderId, ...receiverId],
    });
    await newConversation.save();
    return newConversation;
  },
  getUserConversations: async ({ userId }) => {
    const conversations = await Conversation.find({
      members: { $in: [userId] },
    });
    return conversations;
  },
  addUserToConversation: async ({ conversationId, newUserId }) => {
    const conversation = await Conversation.findById(conversationId);

    await conversation.updateOne({
      $push: { members: newUserId },
    });
    const newConversation = await Conversation.findById(conversationId);
    return newConversation;
  },
  deleteUserFromConversation: async ({ conversationId, removedUserId }) => {
    const conversation = await Conversation.findById(conversationId);
    await conversation.updateOne({
      $pull: { members: removedUserId },
    });
    const newConversation = await Conversation.findById(conversationId);
    return newConversation;
  },
};

module.exports = resolvers;
