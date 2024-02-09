// index.js
const cluster = require("cluster");
require("dotenv").config();
const Router = require("./src/routes/indexRoute");
const numCPUs = require("os").cpus().length;
const cron = require('node-cron');
const { updateFeatureItemCron } = require("./src/controllers/superAdminController");
const { fetchInstantForUser } = require('./src/controllers/notificationController')

let io;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) { cluster.fork() }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const express = require("express");
  const session = require('express-session');
  const cors = require("cors");
  const app = express();
  const socket = require("socket.io");
  let cookieParser = require("cookie-parser");

  app.use(cookieParser());


  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({ secret: 'RentoPlaceService', resave: false, saveUninitialized: true }));
  app.use(express.static('uploads'))
  app.use(express.static('public'))

  let cronJob = cron.schedule('59 23 * * *', async () => {
    await updateFeatureItemCron();
  });

  cronJob.start();


  const server = app.listen(process.env.PORT, () =>
    console.log(`Worker ${process.pid} started on ${process.env.PORT}`)
  );

  const io = require('socket.io')(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  const onlineUsers = new Map();

  io.on("connection", async (socket) => {
    console.log("user connected");
    let userId;

    socket.on("add-user", (user) => {
      userId = user;
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      const sendUserSocket = onlineUsers.get(data.to);

      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message_content);
      }
    });

    const emitNotifications = async (userId) => {
      try {
        const notifications = await fetchInstantForUser(userId);
        console.log(notifications, "11111111111notification");
        const sendUserSocket = onlineUsers.get(userId);

        if (sendUserSocket && notifications.length > 0) {
          socket.to(sendUserSocket).emit("notifications", notifications);
        } else {
          // Emit an error event if notifications are empty or user is not found
          socket.emit("notification-error", { message: "Notifications not found for user" });
        }
      } catch (error) {
        console.error("Error fetching and emitting notifications:", error);
        // Emit an error event to the client
        socket.emit("notification-error", { message: error.message });
      }
    };


    socket.on("add-user", (user) => {
      userId = user;
      onlineUsers.set(userId, socket.id);
      emitNotifications(userId);
    });

    socket.on("fetch-notifications", () => {
      if (userId) {
        console.log(userId, "useridddddddd");
        emitNotifications(userId);
      }
    });
  });


  app.use('/api/v1', Router);

  app.use("/api/demo", (req, res) => {
    res.status(200).send({
      message: "Working",
    });
  });
}

// module.exports.io = io;