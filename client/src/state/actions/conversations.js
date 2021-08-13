export const Types = {
  CONVERSATIONS_REQUEST: "CONVERSATIONS_REQUEST",
  CONVERSATIONS_SUCCES: "CONVERSATIONS_SUCCES",
  CONVERSATIONS_ERROR: "CONVERSATIONS_ERROR",
  CREATE_CONVERSATION_REQUEST: "CREATE_CONVERSATION_REQUEST",
  CREATE_CONVERSATION_SUCCES: "CREATE_CONVERSATION_SUCCES",
  SEND_CONVERSATION: "SEND_CONVERSATION",
  RECEIVE_CONVERSATION: "RECEIVE_CONVERSATION",
  ADD_FRIEND_TO_CONVERSATION_REQUEST: "ADD_FRIEND_TO_CONVERSATION_REQUEST",
  ADD_FRIEND_TO_CONVERSATION_SUCCES: "ADD_FRIEND_TO_CONVERSATION_SUCCES",
  DELETE_FRIEND_FROM_CONVERSATION_REQUEST:
    "DELETE_FRIEND_FROM_CONVERSATION_REQUEST",
  DELETE_FRIEND_FROM_CONVERSATION_SUCCES:
    "DELETE_FRIEND_FROM_CONVERSATION_SUCCES",
  USER_QUITS_CONVERSATION_REQUEST: "USER_QUITS_CONVERSATION_REQUEST",
  USER_QUITS_CONVERSATION_SUCCES: "USER_QUITS_CONVERSATION_SUCCES",
};

const baseURL = "/graph";
//const baseURL = "http://localhost:8000";

export const userQuitsConversation = (conversationId, removedUserId) => ({
  type: Types.USER_QUITS_CONVERSATION_REQUEST,
  payload: {
    query: `
  mutation {
     deleteUserFromConversation(conversationId:"${conversationId}", removedUserId:"${removedUserId}"){
     _id
     members
     createdAt
     updatedAt
   }
  }
  `,
  },
  meta: {
    method: "POST",
    url: baseURL + "/graphql",
    succes: Types.USER_QUITS_CONVERSATION_SUCCES,
    graphql: true,
    removedUserId,
  },
});

export const deleteFriendFromConversation = (
  conversationId,
  removedUserId
) => ({
  type: Types.DELETE_FRIEND_FROM_CONVERSATION_REQUEST,
  payload: {
    query: `
  mutation {
     deleteUserFromConversation(conversationId:"${conversationId}", removedUserId:"${removedUserId}"){
     _id
     members
     createdAt
     updatedAt
   }
  }
  `,
  },
  meta: {
    method: "POST",
    url: baseURL + "/graphql",
    succes: Types.DELETE_FRIEND_FROM_CONVERSATION_SUCCES,
    graphql: true,
    removedUserId,
  },
});

export const addFriendToConversation = (conversationId, newUserId) => ({
  type: Types.ADD_FRIEND_TO_CONVERSATION_REQUEST,
  payload: {
    query: `
  mutation {
    addUserToConversation(conversationId:"${conversationId}", newUserId:"${newUserId}"){
     _id
     members
     createdAt
     updatedAt
   }
  }
  `,
  },
  meta: {
    method: "POST",
    url: baseURL + "/graphql",
    succes: Types.ADD_FRIEND_TO_CONVERSATION_SUCCES,
    graphql: true,
  },
});

export const conversationsRequest = (user) => ({
  type: Types.CONVERSATIONS_REQUEST,
  payload: {
    query: `
  query {
    getUserConversations(userId:"${user.id}"){
     _id
     members
     createdAt
     updatedAt
   }
  }
  `,
  },
  meta: {
    method: "POST",
    url: baseURL + "/graphql",
    succes: Types.CONVERSATIONS_SUCCES,
    error: Types.CONVERSATIONS_ERROR,
    graphql: true,
  },
});

export const createConversation = (senderId, receiverId) => ({
  type: Types.CREATE_CONVERSATION_REQUEST,
  payload: {
    query: `
  mutation {
    createConversation(senderId:"${senderId}", receiverId:"${receiverId}"){
     _id
     members
     createdAt
     updatedAt
   }
  }
  `,
  },
  meta: {
    method: "POST",
    url: baseURL + "/graphql",
    succes: Types.CREATE_CONVERSATION_SUCCES,
    graphql: true,
    senderId,
    receiverId,
  },
});

export const sendConversation = (sender, receiver, conversation) => ({
  type: "mess",
  payload: {
    type: Types.SEND_CONVERSATION,
    sender,
    receiver,
    conversation,
  },
});

export const receiveConversation = (conversation) => ({
  type: Types.RECEIVE_CONVERSATION,
  payload: conversation,
});
