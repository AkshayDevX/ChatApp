const express = require("express");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");
const connectDatabase = require("./config/database");
const ErrorHandler = require("./utils/errorHandler");

const app = express();

const http = require("http").Server(app);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

const { MongoSessionStore } = require("./sessionStore");
const sessionStore = new MongoSessionStore();

const { MongoMessageStore } = require("./messageStore");
const messageStore = new MongoMessageStore();

// Connect to database
connectDatabase();

// socket io
const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// socket io auth middleware
socketIO.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.userID;

  if (sessionID) {
    // find existing session
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.userID = session?._id;
      socket.username = session?.name;
      return next();
    }
  }
  if (!sessionID) {
    return next(new ErrorHandler("internal server error", 500));
  }
  next();
});

// socket io event handlers
socketIO.on("connection", async (socket) => {
  console.log(`⚡: ${socket.userID} user just connected!`);

  // persist session
  sessionStore.saveSession(socket.userID, {
    connected: true,
  });

  // emit session details
  socket.emit("session", {
    userID: socket.userID,
  });

  // join room
  socket.join(socket.userID);

  // fetch existing users
  const users = [];
  // const messagesPerUser = new Map();
  // const messages = await messageStore?.findMessagesForUser(socket.userID);

  // if (Array.isArray(messages)) {
  //   messages.forEach((message) => {
  //     const { from, to } = message;
  //     const otherUser = socket.userID === from ? to : from;
  //     if (messagesPerUser.has(otherUser)) {
  //       messagesPerUser.get(otherUser)?.push(message);
  //     } else {
  //       messagesPerUser.set(otherUser, [message]);
  //     }
  //   });
  // }
  const sessions = await sessionStore.findAllSessions();

  if (Array.isArray(sessions)) {
    sessions.forEach((session) => {
      users.push({
        userID: session._id,
        username: session.name,
        connected: session.connected,
      });
    });
  }

  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
  });

  // send private message
  socket.on("private message", ({ content, to }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });

  // user disconnection
  socket.on("disconnect", async () => {
    console.log(`💀: ${socket.userID} user just disconnected`);
    const matchingSockets = await socketIO.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.userID, {
        connected: false,
      });
    }
  });
});

// routes
const user = require("./routes/userRoutes");

// routes middleware

app.use("/api/v1", user);

// error middleware
app.use(errorMiddleware);

const port = process.env.PORT || 8000;

http.listen(port, () => {
  console.log(
    `🔥 Server is running on port ${port} in ${process.env.NODE_ENV} mode`
  );
});
