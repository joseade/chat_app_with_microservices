var express = require("express");
const mongoose = require("mongoose");

var cors = require("cors");
var { graphqlHTTP } = require("express-graphql");

const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");

var app = express();
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: typeDefs,
    rootValue: resolvers,
    graphiql: true,
  })
);
//app.listen(4000, () => console.log("Now browse to localhost:4000/graphql"));
//console.log(process.env.MONGO_URL);

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

  app.listen(8000, () => {
    console.log("Listening on port 8000!!!!!!!");
  });
};

start();
