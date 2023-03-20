const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: String,
  lastName: String,
  nickName: String,
  email: {
    required: true,
    unique: true,
    type: String,
  },
  address: String,
  phoneNumber: Number,
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  profilePicture: { type: mongoose.Schema.Types.Mixed, default: {} },
  salt: String,
  password: String,
  admin: Number,
});

module.exports = User;
