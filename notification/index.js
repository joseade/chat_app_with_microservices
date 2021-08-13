const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = 5000;

let users = [];

const addUser = (userId, socketId, name, profilePicture, email) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId, name, profilePicture, email });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

app.get("/adelino", (req, res) => {
  res.send("HOLA");
});

io.on("connection", (socket) => {
  //when connect
  console.log("a user connected.");

  socket.on("message", (payload) => {
    switch (payload.type) {
      case "ADD_USER": {
        addUser(
          payload.userId,
          socket.id,
          payload.name,
          payload.profilePicture,
          payload.email
        );
        io.emit("message", { type: "GET_USERS", payload: users });
        return;
      }
      case "SEND_FOLLOWER": {
        const { sender, receiver } = payload;
        const user = getUser(receiver.id);
        if (user === undefined) {
          return;
        }
        io.to(user.socketId).emit("message", {
          type: "GET_FOLLOWER",
          payload: sender,
        });
        return;
      }
      case "SEND_CONVERSATION": {
        const { receiver, conversation } = payload;
        const user = getUser(receiver);
        if (user === undefined) {
          return;
        }
        io.to(user.socketId).emit("message", {
          type: "GET_CONVERSATION",
          payload: conversation,
        });

        return;
      }

      case "SEND_MESSAGE": {
        const { receiver, message } = payload;
        const user = getUser(receiver);
        if (user === undefined) {
          return;
        }
        io.to(user.socketId).emit("message", {
          type: "GET_MESSAGE",
          payload: message,
        });

        return;
      }
    }
  });

  //when disconnect
  socket.on("logout", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("message", { type: "GET_USERS", payload: users });
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    //io.emit("getUsers", users);
    io.emit("message", { type: "GET_USERS", payload: users });
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
