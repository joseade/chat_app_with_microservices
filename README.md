# Chat Application Notes

To run the project, we need to follow the next commands:

- minikube start --driver=hyperkit,
- mnikube addons enbale ingress,
- kubectl apply -f k8, and
- Put the IP obtained using the command minikube ip in your web browser.

The application consist of five services:

- auth-service,
- mongodb-service,
- chat-service (graphQL server),
- client-service (react app), and
- notification-service (socket.io)

Global variables

The communication to the microservice including the database is done by using the global variable
MONGO_URL which has the value "mongodb://mongodb-service:27017/chatapp"
