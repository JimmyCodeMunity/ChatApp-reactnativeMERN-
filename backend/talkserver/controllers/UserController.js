const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("../model/UserModel");
const jwt = require("jsonwebtoken");
const Driver = require("../model/DriverModel");
const Message = require("../model/MessageModel");

// if (process.env.NODE_ENV !== "PRODUCTION") {
//     require("dotenv").config({
//       path: "../.env",
//     });
//   }

const jwttoken = process.env.JWT_SECRET;
console.log("token", jwttoken);

//register new user
const createUser = async (req, res) => {
  try {
    const { name, email, password, image } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        image,
        requests: [],
        friends: [],
      });
      res
        .status(200)
        .json({ message: "user account created successfully", user });
    }
  } catch (error) {
    console.log("error creating new user:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};

// login user
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    } else {
      const token = jwt.sign({ email: user.email }, jwttoken);
      if (res.status(200)) {
        console.log("login successfull");
        return res.send({ status: "ok", data: token });
      } else {
        return res.send({ error: "error" });
      }
    }
  } catch (error) {}
};

// get userdata
const getUserData = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await jwt.verify(token, jwttoken);
    const useremail = user.email;
    const userdata = await User.findOne({ email: useremail });
    if (!userdata) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log(userdata);
    res
      .status(200)
      .json({ message: "User data fetched successfully", userdata });
  } catch (error) {
    console.log("error getting user data:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};

const getOtherUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.find({ _id: { $ne: userId } });
    res.status(200).json(users);
  } catch (error) {
    console.log("error getting other users:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};

const sendRequest = async (req, res,userSocketMap) => {
  try {
    const { senderId, receiverId, message } = req.body;
    console.log("sid", senderId);
    console.log("rid", receiverId);
    console.log("msg", message);
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      res.status(404).json({ message: "Receiver not found." });
    }

    receiver.requests.push({
      from: senderId,
      messages: message,
      status: "pending",
    });
    await receiver.save();
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      console.log("emmiting receive messsage event to", receiverId);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log("receiver socketid not found");
    }
    res.status(200).json(receiver.requests);
  } catch (error) {
    console.log("error sending request:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};

const getRequests = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate(
      "requests.from",
      "name email image"
    );

    if (user) {
      res.status(200).json(user.requests);
    } else {
      res.status(400).json({ message: "User not found." });
    }
  } catch (error) {
    console.log("error getting requests:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};

const acceptRequests = async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const updateduser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { requests: { from: requestId } },
      },
      {
        new: true,
      }
    );

    if (!updateduser) {
      return res.status(404).json({ message: "Request not found." });
    }

    await User.findByIdAndUpdate(userId, {
      $push: { friends: requestId },
    });

    const friendUser = await User.findByIdAndUpdate(requestId, {
      $push: { friends: userId },
    });

    if (!friendUser) {
      return res.status(404).json({ message: "Friend not found." });
    }

    res.status(200).json({ message: "Request Accepted" });
  } catch (error) {
    console.log("error accepting request:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};

const getChats = async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    if (!users) {
      return res.status(404).json({ message: "Users not found." });
    }
    res.status(200).json(users.friends);
  } catch (error) {
    console.log("error getting chats:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};

// const sendMessage = async (req, res, receiverSocketId,userid,senderId, receiverId, message) => {
//   try {
//     // const { senderId, receiverId, message } = req.body;
//     console.log("sid",senderId)
//     return
//     // console.log("receiversocket",senderId)
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });
//     await newMessage.save();
//     // const receiverSocketId = userSocketMap[receiverId];
//     if (receiverSocketId) {
//       console.log("emmiting receive messsage event to", receiverId);
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     } else {
//       console.log("receiver socketid not found");
//     }
//     res.status(200).json(newMessage);
//   } catch (error) {
//     console.log("error sending message:", error);
//     res.status(500).json({ message: error.message });
//     return;
//   }
// };


const sendMessage = async (io, receiverSocketId, senderId, receiverId, message) => {
  try {
    // Save the message in the database
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    // Emit the newMessage event to the receiver if they're online
    if (receiverSocketId) {
      console.log("Emitting receiveMessage event to", receiverId);
      io.to(receiverSocketId).emit("newMessage", { senderId, receiverId, message });
    } else {
      console.log("Receiver socket ID not found");
    }
  } catch (error) {
    console.log("Error sending message:", error);
  }
};
const getMessages = async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;
    const messages = await Message.find({
      $or: [
        { senderId:senderId,receiverId:receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate("senderId", "_id name");
    res.status(200).json(messages);
  } catch (error) {
    console.log("error getting messages:", error);
    res.status(500).json({ message: error.message });
    return;
  }
};
const findOnlineDrivers = async (req, res) => {
  try {
    const onlineDrivers = await Driver.find({ isOnline: true });
    // console.log("found driver", onlineDrivers);
    res.status(200).json(onlineDrivers);
  } catch (error) {
    console.log("error gettings drivers", error);
    res.status(401).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User data fetched successfully", user });
  } catch (error) {
    console.error("Error getting user data", error);
    res.status(500).json({ error: "Failed to get user data." });
  }
};

module.exports = {
  createUser,
  userLogin,
  getUserData,
  findOnlineDrivers,
  getUserById,
  getOtherUsers,
  sendRequest,
  getRequests,
  acceptRequests,
  getChats,
  sendMessage,
  getMessages
};
