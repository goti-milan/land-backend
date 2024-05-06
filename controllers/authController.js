const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");

const maxAge = process.env.ACTIVE_DAYS * 24 * 60 * 60;

exports.protect = (req, res, next) => {
  return isValidToken(req, res, next, "writer");
};

exports.protectAdmin = (req, res, next) => {
  return isValidToken(req, res, next, "admin");
};

const isValidToken = (req, res, next, role) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    return res.status(401).json({ status: "error" });
  }

  if (!token) {
    return res.status(401).json({ status: "error" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || !user.role || user.role != role) {
      return res.status(401).json({ status: "error" });
    } else {
      return res
        .status(200)
        .json({ status: "success", token, role: user.role });
    }
  });
};

const authorizeJWT = (req, res, next, role) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    return next(new AppError("Authorization failed.", 401));
  }
  // console.log("authorization " + req.headers.authorization);
  // console.log("jwt cookie " + req.cookies.jwt);

  if (!token) {
    return next(new AppError("Authorization failed.", 401));
  }

  // 2) Verification token
  // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err || !user.role) {
      return next(new AppError("Authorization failed.", 401));
    } else {
      next();
    }
  });
};

exports.authorizeAdmin = (req, res, next) => {
  return authorizeJWT(req, res, next, "admin");
};

exports.authorizeWriter = (req, res, next) => {
  return authorizeJWT(req, res, next, "writer");
};

const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
};

exports.adminLogin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ username: username, role: "admin" }).select("+password +role");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 400));
  }

  // 3) If everything ok, send token to client
  createSendToken(user._id, user.role, 200, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Check if username and password exist
  if (!username || !password) {
    return next(new AppError("Please provide username and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ username, role: "writer" }).select("+password +role");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect username or password", 400));
  }

  // 3) If everything ok, send token to client
  createSendToken(user._id, user.role, 200, req, res);
});

const createSendToken = (userID, role, statusCode, req, res) => {
  const token = createToken(userID, role);
  const isSecure = true; //process.env.NODE_ENV === "production" && (req.secure || req.headers['x-forwarded-proto'] === 'https');
  const max = maxAge * 1000;

  // res.cookie("jwt", token, {
  //   maxAge: max,
  //   sameSite: "none",
  //   path: "/",
  //   secure: isSecure,
  // });

  // // Remove password from output
  // user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    role,
    token,
  });
};

exports.logout = (req, res) => {
  res
    .clearCookie("role")
    .clearCookie("jwt")
    .status(200)
    .json({ status: "success" });
};

exports.addWriter = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    username: req.body.username,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: "writer",
  });

  return createSendToken(newUser._id, newUser.role, 200, req, res);
});

exports.decodeToken = async (authorization) => {
  if (authorization && authorization.startsWith("Bearer")) {
    token = authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else {
    return res.status(401).json({ status: "error" });
  }

  if (!token) {
    return res.status(401).json({ status: "error" });
  }

  return jwt.verify(token, process.env.JWT_SECRET);
};
