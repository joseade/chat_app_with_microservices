import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CanvasDraw from "react-canvas-draw";
import { useTranslation } from "react-i18next";

import MessageSender from "../message/MessageSender";
import MessageReceiver from "../message/MessageReceiver";
import * as actionsChat from "../../state/actions/chat";

import { Button, Grid } from "@material-ui/core";
import { TextareaAutosize } from "@material-ui/core";

const ChatSection = () => {
  const { chat, user } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const scrollRef = useRef();
  const sendCanvas = useRef();

  const { conversation, messages } = chat;
  const { friends } = user;
  const [newMessage, setNewMessage] = useState("");
  const [showCanvas, setShowCanvas] = useState(false);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    let sendText;
    if (showCanvas) {
      const data = sendCanvas.current.getSaveData();
      if (!data.includes("brushRadius")) {
        setShowCanvas((p) => !p);
        return;
      }
      sendText = data;
    } else {
      sendText = newMessage;
    }
    if (sendText === "") return;

    //console.log(sendText.toString().replace(/"/g, "*"));
    dispatch(
      actionsChat.createMessage(
        conversation._id,
        user.id,
        sendText,
        conversation.members
      )
    );
    setShowCanvas(false);
    setNewMessage("");
  };

  return (
    <div className="h-100 col-6 d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
      {conversation ? (
        <>
          <div className="h-75 overflow-auto">
            {messages.map((message) => (
              <div ref={scrollRef}>
                {message.sender === user.id ? (
                  <MessageSender
                    message={message}
                    name={user.name}
                    userPicture={user.profilePicture}
                  />
                ) : (
                  <>
                    {message.members.includes(user.id) && (
                      <MessageReceiver
                        message={message}
                        receiverPicture={
                          friends.filter(
                            (friend) => friend.id === message.sender
                          )[0]?.profilePicture
                        }
                        receiverName={
                          friends.filter(
                            (friend) => friend.id === message.sender
                          )[0]?.name
                        }
                      />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <Grid
            container
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              height: "25%",
            }}
          >
            {showCanvas ? (
              <CanvasDraw
                ref={sendCanvas}
                className="border border-dark"
                //canvasWidth={550}
                //canvasHeight={170}
                style={{ width: "60%", height: "90%" }}
              />
            ) : (
              <TextareaAutosize
                style={{ width: "60%", height: "90%" }}
                maxRows={4}
                aria-label="maximum height"
                placeholder="Maximum 4 rows"
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
            )}
            <Grid
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                width: "30%",
                height: "90%",
              }}
            >
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
              >
                {t("chat.send")}
              </Button>
              <Button
                onClick={() => setShowCanvas((p) => !p)}
                variant="contained"
                color="primary"
              >
                {showCanvas ? t("chat.cancel") : t("chat.draw")}
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <div className="text-center mt-5 fs-1">
          <span>{t("chat.start")}</span>
        </div>
      )}
    </div>
  );
};

export default ChatSection;
