import { Server } from "socket.io";

let io;

export const initSocket = (httpserver) => {
  io = new Server(httpserver, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  console.log("Socket io initialized")

  io.on("connection", (socket) => {
    console.log("A user connected: " + socket.id);
  });

};


export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  } 
  return io;
};