const express = require("express");
require("express-async-errors");
const cors = require("cors");

const { json } = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");

const currentUserRouter = require("./routes/current-user");
const signinRouter = require("./routes/signin");
const signoutRouter = require("./routes/signout");
const signupRouter = require("./routes/signup");
//const conversationRouter = require("./routes/conversation");
//const messageRouter = require("./routes/message");

const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./errors/not-found-error");

const app = express();
app.set("trust proxy", true);
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

// App Setup
app.use(morgan("tiny"));
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
//app.use(messageRouter);
//app.use(conversationRouter);

app.get("*", () => {
  throw new NotFoundError();
});
app.use(errorHandler);

//console.log(process.env.MONGO_URL);
//""mongodb://mongodb-service:27017/chatapp""
//"mongodb+srv://ade:123@cluster0.lqbvu.mongodb.net/chatapp"
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }

  app.listen(4000, () => {
    console.log("Listening on port 4000!!!!!!!");
  });
};

start();
