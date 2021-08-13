import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import axios from "axios";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";

import rootSaga from "./state/sagas";
import reducers from "./state/reducers";
import App from "./components/App";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import "./i18n";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = window.location.origin;
//axios.defaults.baseURL = "http://localhost:4000";

const logger = createLogger();
const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducers, applyMiddleware(sagaMiddleware, logger));
sagaMiddleware.run(rootSaga);

// const client = new ApolloClient({
//   uri: window.location.origin + "/socket/graphql",
//   cache: new InMemoryCache(),
// });

// client
//   .query({
//     query: gql`
//       query {
//         hello {
//           userId
//           socketId
//           profilePicture
//           name
//           email
//         }
//       }
//     `,
//   })
//   .then((result) => console.log(result));

ReactDOM.render(
  // <ApolloProvider client={client}>
  <Provider store={store}>
    <App />
  </Provider>,
  // </ApolloProvider>
  document.getElementById("root")
);
