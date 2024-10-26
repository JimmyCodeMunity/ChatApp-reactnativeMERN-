const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const geolib = require("geolib");
// const io = require("socket.io")(http);

const port = 8000;
const socketport = 3000;
const dbconn = "mongodb+srv://devjimin02:Ghost02@talkapp.xd3ja.mongodb.net/?retryWrites=true&w=majority&appName=talkapp";
// const dbconn = process.env.MONGODB_URI;





const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
const GOOGLE_MAPS_API_KEY = "AIzaSyDdUQ1EIQJB46n2RSusQro1qP3Pd4mGZcA";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: ["http://localhost:3000", "http://localhost:3001","https://cbfe-41-139-202-31.ngrok-free.app"], // Add multiple origins here
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("user connected successfully", socket.id);
  const userId = socket.handshake.query.userId;
  console.log("userid", userId);

  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }
  console.log("user socket map", userSocketMap);
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    console.log("user socket map after disconnect", userSocketMap);
  });


  socket.on("sendMessage",({senderId,receiverId,message})=>{
    const receiverSocketId = userSocketMap[receiverId];
    // console.log("receiverSocketId", receiverSocketId);
    // console.log("receiverId", receiverId);
    // console.log("message", message);
    // console.log("senders id", senderId);
    // const sendingfrom = senderId;
    
    if(receiverSocketId){
      // sendMessage(userid,senderId, receiverId, message,receiverSocketId)
      // io.to(receiverSocketId).emit("newMessage", {senderId:sendingfrom, receiverId, message});
      sendMessage(io, receiverSocketId, senderId, receiverId, message);
    }
  })


  socket.on("findDriver",({senderId,startLocation,destinationLocation})=>{
    console.log("finding driver for",senderId,'from',startLocation)

  })
});



if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "./.env",
  });
}





app.get("/", (req, res) => {
  res.send("Server is running");
});

server.listen(port, (req, res) => {
  console.log(`Server running on port ${port}`);
});

// database connection
mongoose
  .connect(dbconn, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) => {
    console.log("Database Connected");
  })
  .catch((error) => {
    console.error("Error connecting to Database", error);
  });

const userroutes = require("./routes/UserRoutes");
const { sendMessage } = require("./controllers/UserController");

app.use("/api/v1/user", userroutes);

// socket
