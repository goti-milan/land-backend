const mongoose = require("mongoose");

const appuserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "username is required"],
    trim: true,
  },
  email: {
    type: String,
    require: [true, "email is required"],
    trim: true,
  },
  password: {
    type: String,
    require: [true, "password is required"],
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  auth: {
    accessToken: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
      trim: true,
    },
  },
  resetToken: {
    type: String,
    trim: true,
    default: "",
  },
});

module.exports = mongoose.model("appuser", appuserSchema);
