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

  // const io = require('socket.io')(server, {
  //   cors: {
  //     origin: "*",
  //     credentials: true,
  //   },
  // });

  // const onlineUsers = new Map();

  // io.on("connection", (socket) => {
  //   console.log("user connected");
  //   global.chatSocket = socket;
  //   let userId;

  //   socket.on("add-user", (user) => {
  //     userId = user;
  //     onlineUsers.set(userId, socket.id);

  //     // Fetch notifications for the user and emit to their socket connection
  //     fetchInstantForUser(userId)
  //       .then((notifications) => {
  //         console.log(notifications, "1111111111111");
  //         emitNotificationsToUser(socket, notifications); // Emit notifications to the user
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching notifications:", error);
  //       });
  //   });

  //   socket.on("disconnect", (userData) => {
  //     onlineUsers.delete(userId);
  //     console.log('User disconnected');
  //   });

  //   socket.on("send-msg", (data) => {
  //     console.log(data, "send-msg");
  //     const sendUserSocket = onlineUsers.get(data.to);

  //     if (sendUserSocket) {
  //       socket.to(sendUserSocket).emit("msg-recieve", data.message_content);
  //     }
  //   });
  // });

  // // Function to emit notifications to a specific user
  // function emitNotificationsToUser(socket, notifications) {
  //   console.log(notifications, "111111111");
  //   socket.emit("notifications", notifications);
  // }

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

    // Function to fetch and emit notifications for a user
    const emitNotifications = async (userId) => {
      try {
        const notifications = await fetchInstantForUser(userId);
        console.log(notifications, "emit notifications");
        const sendUserSocket = onlineUsers.get(userId);

        if (sendUserSocket && notifications.length > 0) {
          socket.to(sendUserSocket).emit("notifications", notifications);
        }
      } catch (error) {
        console.error("Error fetching and emitting notifications:", error);
      }
    };

    // Emit notifications when a user is added
    socket.on("add-user", (user) => {
      userId = user;
      onlineUsers.set(userId, socket.id);
      emitNotifications(userId); // Emit notifications for the newly added user
    });

    // Emit notifications when requested by the client
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