const cluster = require("cluster");
require("dotenv").config();
const Router = require("./src/routes/indexRoute");
const numCPUs = require("os").cpus().length;
const cron = require('node-cron');
const { updateFeatureItemCron } = require("./src/controllers/superAdminController");
const { fetchInstantForUser } = require('./src/controllers/notificationController');
const { Client: PGClient } = require('pg');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

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
  app.use(express.static('uploads'));
  app.use(express.static('public'));

  let cronJob = cron.schedule('59 23 * * *', async () => {
    await updateFeatureItemCron();
  });

  cronJob.start();

  const server = app.listen(process.env.PORT, () =>
    console.log(`Worker ${process.pid} started on ${process.env.PORT}`)
  );

  const io = socket(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("add-user", (userId) => {
      console.log(`${userId} connected to the chat service.`);
      onlineUsers.set(userId, socket.id);
    });

    socket.on("disconnect", () => {
      for (let [key, value] of onlineUsers.entries()) {
        if (value === socket.id) {
          console.log(`${key} disconnected from the chat service.`);
          onlineUsers.delete(key);
          break;
        }
      }
    });

    socket.on("send-msg", (data) => {
      console.log(data, "send-msg");
      const sendUserSocket = onlineUsers.get(data.to);

      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.message_content);
      }
    });
  });

  const pgClient = new PGClient({
    user: 'postgres',
    host: 'localhost',
    database: 'rental_service',
    password: 'root',
    port: 5432,
  });

  pgClient.connect()
    .then(async () => {
      console.log('Database connected successfully...');
      await pgClient.query('LISTEN new_notification');
    })
    .catch(err => console.error('Database connection error:', err));

  pgClient.on('notification', async (msg) => {
    console.log('Received notification:', msg.payload);
    const notification = JSON.parse(msg.payload);
    console.log(notification, "Received ");
    if (notification && notification.user_id) {
      const userId = notification.user_id;
      const userNotifications = await fetchInstantForUser(userId);
      if (userNotifications.length > 0) {
        const latestNotification = userNotifications;
        emitNotificationToUser(userId, latestNotification);
      }
    } else {
      console.error('Invalid notification format:', notification);
    }
  });



  const emitNotificationToUser = (userId, notification) => {
    const userSocket = onlineUsers.get(userId);
    if (userSocket) {
      console.log(userSocket, "userSocket");
      io.to(userSocket).emit("notification", notification);
    }
  };

  app.use('/api/v1', Router);

  app.use("/api/demo", (req, res) => {
    res.status(200).send({
      message: "Working",
    });
  });
}
