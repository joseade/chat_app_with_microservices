var { buildSchema } = require("graphql");
const { DateTime } = require("graphql-scalars");

const typeDefs = buildSchema(`
scalar DateTime

type Conversation {
  _id: String,
  members: [String],
  createdAt: DateTime,
  updatedAt: DateTime,
}

type Message {
  members: [String]
  _id: String,
  conversationId: String,
  sender: String,
  text: String,
  createdAt: DateTime,
  updatedAt: DateTime,
}

type User {
  id: String
  name: String
}

type Mutation {
  createConversation(senderId: String, receiverId:[String]): Conversation
  addUserToConversation(conversationId: String, newUserId: String): Conversation
  deleteUserFromConversation(conversationId: String, removedUserId: String): Conversation
  newMessage(conversationId: String, sender: String, text: String): Message
}

type Query {
  getUserConversations(userId: String): [Conversation],
  getMessage(conversationId: String): [Message],
}
`);

module.exports = typeDefs;
