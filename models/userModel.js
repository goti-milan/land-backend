const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema({
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Minimum password length is 6 characters"],
    trim: true,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  username: {
    type: String,
    required: [true, "Please enter your username"],
    lowercase: true,
    unique: true,
    trim: true,
  },
  role: {
    type: String,
    default: "writer",
    enum: ["writer", "admin"],
  },
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Language" }],
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.statics.login = async function (username, password, next) {
  const user = await this.findOne({ username }).select("+password");
  if (user) {
    const auth = await bcrypt.compare(password, user.password); //password
    if (auth) return user;

    next(new AppError("Incorrect password", 400));
  }
  next(new AppError("Incorrect username", 400));
};

const User = mongoose.model("User", userSchema);
module.exports = User;
