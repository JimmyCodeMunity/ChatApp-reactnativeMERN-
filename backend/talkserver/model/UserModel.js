const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
  requests: [
    {
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      messages: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
  ],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});
const User = mongoose.model("User", UserSchema);
module.exports = User;
