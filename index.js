const cluster = require("cluster");
require("dotenv").config();
const connection = require("./src/config/database");
const Router = require("./src/routes/indexROute");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const express = require("express");
  const cors = require("cors");
  const app = express();
  const socket = require("socket.io");

  app.use(cors());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.static('uploads'))
  app.use(express.static('public'))

  const server = app.listen(process.env.PORT, () =>
    console.log(`Worker ${process.pid} started on ${process.env.PORT}`)
  );
  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      console.log(userId);
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
      console.log(data, "dataaaaa");
      const sendUserSocket = onlineUsers.get(data.to);

      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-recieve", data.msg);
      }
    });
  });

  app.use('/api/v1', Router);

  app.use("/demo", (req, res) => {
    res.status(200).send({
      message: "Working",
    });
  });
}
