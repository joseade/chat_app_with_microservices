import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router";
import axios from "axios";
import ConversationsSection from "./Sections/ConversationsSection";
import ChatSection from "./Sections/ChatSection";
import FriendsSection from "./Sections/FriendSection_2.js";
import NavBar from "./Sections/NavBar";
import { useTranslation } from "react-i18next";
import * as actionsSocket from "../state/actions/socket";
import * as actionsConversations from "../state/actions/conversations";
import * as actionsChat from "../state/actions/chat";
import * as actions from "../state/actions/user";

import { Container } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const Dashboard = (props) => {
  const { user, chat, userConversations } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const baseURL = "/api";
  //const baseURL = "http://localhost:8000";
  useEffect(() => {
    if (!user.signin) {
      const getUser = async () => {
        try {
          const res = await axios.get(baseURL + "/users/currentuser");
          const currentUser = { ...res.data.currentUser };
          dispatch(actions.userSuccess(currentUser));
          //dispatch({ type: "LOGIN_USER_SUCCES", payload: currentUser });
          dispatch(actionsSocket.startSocket(currentUser));
          // if (res.data === null) {
          //   console.log('AAA');
          //   return <Redirect to={'/login'} />;
          // }
        } catch (error) {
          props.history.push("/login");
        }
      };
      getUser();
    }
  }, []);

  useEffect(() => {
    if (user.signin) {
      dispatch(actionsConversations.conversationsRequest(user));
      i18n.changeLanguage(user.language);
    }
  }, [user.signin]);

  useEffect(() => {
    //chat.conversation._id;
    if (chat.conversation !== null) {
      const newConversation = userConversations.conversations.filter(
        (conversation) => {
          return conversation._id === chat.conversation._id;
        }
      );
      if (newConversation[0]?.members.length !== chat.conversation.length) {
        dispatch(actionsChat.updateChat(newConversation[0].members));
        //dispatch({ type: "UPDATE_CHAT", payload: newConversation[0].members });
      }
      if (newConversation.length === 0) {
        dispatch(actionsChat.deleteChat());
        //dispatch({ type: "DELETE_CHAT" });
      }
    }
  }, [userConversations]);

  return (
    <Container style={{ height: "100vh" }}>
      <NavBar props={props} />
      <Grid container direction="row" style={{ height: "90vh" }}>
        <ConversationsSection />
        <ChatSection />
        <FriendsSection />
      </Grid>
    </Container>
  );
};

export default Dashboard;
