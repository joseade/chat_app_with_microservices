export const Types = {
  GET_CONVERSATION: "GET_CONVERSATION",
  MESSAGES_REQUEST: "MESSAGES_REQUEST",
  MESSAGES_SUCCES: "MESSAGES_SUCCES",
  MESSAGES_ERROR: "MESSAGES_ERROR",
  CREATE_MESSAGE_REQUEST: "CREATE_MESSAGE_REQUEST",
  CREATE_MESSAGE_SUCCES: "CREATE_MESSAGE_SUCCES",
  SEND_MESSAGE: "SEND_MESSAGE",
  RECEIVE_MESSAGE: "RECEIVE_MESSAGE",
  UPDATE_CHAT: "UPDATE_CHAT",
  DELETE_CHAT: "DELETE_CHAT",
};

export const updateChat = (newChat) => {
  return {
    type: Types.UPDATE_CHAT,
    payload: newChat,
  };
};

export const deleteChat = () => {
  return {
    type: Types.DELETE_CHAT,
  };
};

export const getConversation = (conversation) => ({
  type: Types.GET_CONVERSATION,
  payload: conversation,
});

const baseURL = "/graph";
//const baseURL = "http://localhost:8000";
export const messagesRequest = (conversation) => ({
  type: Types.MESSAGES_REQUEST,
  payload: {
    query: `
  query {
    getMessage(conversationId:"${conversation._id}"){
     members
     _id
     conversationId
     sender
     text
     createdAt
     updatedAt
   }
  }
  `,
  },
  meta: {
    method: "POST",
    url: baseURL + "/graphql",
    succes: Types.MESSAGES_SUCCES,
    error: Types.MESSAGES_ERROR,
    graphql: true,
  },
});

export const createMessage = (conversationId, sender, text, members) => ({
  type: Types.CREATE_MESSAGE_REQUEST,
  payload: {
    query: `
  mutation {
    newMessage(conversationId:"${conversationId}", sender:"${sender}", text:"${text}"){
     members
     _id
     conversationId
     sender
     text
     createdAt
     updatedAt
   }
  }
  `,
  },
  meta: {
    method: "POST",
    url: baseURL + "/graphql",
    succes: Types.CREATE_MESSAGE_SUCCES,
    members,
    graphql: true,
    conversationId,
    sender,
    text,
  },
});

export const sendMessage = (receiver, message) => ({
  type: "mess",
  payload: {
    type: Types.SEND_MESSAGE,
    receiver,
    message,
  },
});

export const receiveMessage = (message) => ({
  type: Types.RECEIVE_MESSAGE,
  payload: message,
});
