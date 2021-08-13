export const Types = {
  REGISTER_USER_REQUEST: "REGISTER_USER_REQUEST",
  REGISTER_USER_SUCCES: "REGISTER_USER_SUCCES",
  REGISTER_USER_ERROR: "REGISTER_USER_ERROR",
  LOGIN_USER_REQUEST: "LOGIN_USER_REQUEST",
  LOGIN_USER_SUCCES: "LOGIN_USER_SUCCES",
  LOGIN_USER_ERROR: "LOGIN_USER_ERROR",
  LOGOUT_USER_REQUEST: "LOGOUT_USER_REQUEST",
  LOGOUT_USER_SUCCES: "LOGOUT_USER_SUCCES",
  LOGOUT_USER_ERROR: "LOGOUT_USER_ERROR",
  SEARCH_USER_REQUEST: "SEARCH_USER_REQUEST",
  SEARCH_USER_SUCCES: "SEARCH_USER_SUCCES",
  SEARCH_USER_ERROR: "SEARCH_USER_ERROR",
  FOLLOW_USER_REQUEST: "FOLLOW_USER_REQUEST",
  FOLLOW_USER_SUCCES: "FOLLOW_USER_SUCCES",
  FOLLOW_USER_ERROR: "FOLLOW_USER_ERROR",
  SEND_FOLLOWER: "SEND_FOLLOWER",
  RECEIVE_FOLLOWER: "RECEIVE_FOLLOWER",
  UPDATE_AVATAR_REQUEST: "UPDATE_AVATAR_REQUEST",
  UPDATE_AVATAR_SUCCES: "UPDATE_AVATAR_SUCCES",
  UPDATE_LANGUAGE_REQUEST: "UPDATE_LANGUAGE_REQUEST",
  UPDATE_LANGUAGE_SUCCES: "UPDATE_LANGUAGE_SUCCES",
  CHANGE_LANGUAGE: "CHANGE_LANGUAGE",
  STOP_SOCKET: "STOP_SOCKET",
  STOP_CHAT: "STOP_CHAT",
  STOP_CONVERSATIONS: "STOP_CONVERSATIONS",
  STOP_USER: "STOP_USER",
  DELETE_SOCKET: "DELETE_SOCKET",
  DELETE_ERRORS: "DELETE_ERRORS",
  BACK_TO_REGISTER: "BACK_TO_REGISTER",
};
export const userSuccess = (user) => {
  return {
    type: Types.LOGIN_USER_SUCCES,
    payload: user,
  };
};
export const returnToRegister = () => {
  return {
    type: Types.BACK_TO_REGISTER,
  };
};
export const deleteErrors = () => {
  return {
    type: Types.DELETE_ERRORS,
  };
};
export const deleteSocket = () => {
  return {
    type: Types.DELETE_SOCKET,
  };
};
export const stopUser = () => {
  return {
    type: Types.STOP_USER,
  };
};
export const stopConversations = () => {
  return {
    type: Types.STOP_CONVERSATIONS,
  };
};
export const stopChat = () => {
  return {
    type: Types.STOP_CHAT,
  };
};
export const stopSocket = () => {
  return {
    type: Types.STOP_SOCKET,
  };
};

export const setLanguage = (language) => {
  return {
    type: Types.CHANGE_LANGUAGE,
    payload: language,
  };
};

const baseURL = "/api";
//const baseURL = "http://localhost:4000";

export const updateLanguage = (language) => ({
  type: Types.UPDATE_LANGUAGE_REQUEST,
  payload: language,
  meta: {
    method: "POST",
    url: baseURL + "/users/language",
    succes: Types.UPDATE_LANGUAGE_SUCCES,
  },
});

export const updateAvatar = (profilePicture) => ({
  type: Types.UPDATE_AVATAR_REQUEST,
  payload: profilePicture,
  meta: {
    method: "POST",
    url: baseURL + "/users/picture",
    succes: Types.UPDATE_AVATAR_SUCCES,
  },
});

export const registerRequest = (user) => ({
  type: Types.REGISTER_USER_REQUEST,
  payload: user,
  meta: {
    method: "POST",
    url: baseURL + "/users/signup",
    succes: Types.REGISTER_USER_SUCCES,
    error: Types.REGISTER_USER_ERROR,
  },
});

export const loginRequest = (user) => ({
  type: Types.LOGIN_USER_REQUEST,
  payload: user,
  meta: {
    method: "POST",
    url: baseURL + "/users/signin",
    succes: Types.LOGIN_USER_SUCCES,
    error: Types.LOGIN_USER_ERROR,
  },
});

export const logoutRequest = (user) => ({
  type: Types.LOGOUT_USER_REQUEST,
  payload: user,
  meta: {
    method: "POST",
    url: baseURL + "/users/signout",
    succes: Types.LOGOUT_USER_SUCCES,
    error: Types.LOGOUT_USER_ERROR,
  },
});

export const searchUserRequest = (user) => ({
  type: Types.SEARCH_USER_REQUEST,
  payload: user,
  meta: {
    method: "GET",
    url: baseURL + `/users/${user}`,
    succes: Types.SEARCH_USER_SUCCES,
    error: Types.SEARCH_USER_ERROR,
  },
});

export const followUserRequest = (user, friend) => ({
  type: Types.FOLLOW_USER_REQUEST,
  payload: friend,
  meta: {
    method: "POST",
    url: baseURL + `/users/${user.id}/follow`,
    succes: Types.FOLLOW_USER_SUCCES,
    error: Types.FOLLOW_USER_ERROR,
  },
});

export const sendFollower = (sender, receiver) => ({
  type: "mess",
  payload: {
    type: Types.SEND_FOLLOWER,
    sender,
    receiver,
  },
});

export const receiveFollower = (user) => ({
  type: Types.RECEIVE_FOLLOWER,
  payload: user,
});
