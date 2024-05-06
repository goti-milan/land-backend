const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

module.exports = catchAsync(async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) throw Error("Please add token");

    const user = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = { role: user.role, uid: user.id };
    next();
  } catch (err) {
    console.log("err", err);
    return next(new AppError(err.message, 400));
  }
});
