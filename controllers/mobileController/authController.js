const Appuser = require("../../models/appuserModel");
const AppError = require("../../utils/appError");
const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require("../../utils/catchAsync");
const randtoken = require("rand-token").suid;
const { localize } = require("../../middlewares/localizifyMobileAPI");

const maxAge = process.env.ACTIVE_DAYS;

exports.signUp = catchAsync(async (req, res, next) => {
  try {
    const { name, email, password } = req.body; 
    const localize = req.localize;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ status: localize.translate("fail"), errors: errors.array() });
    }

    const checkUser = await Appuser.findOne({ email: email, active: true });

    if (checkUser)
      throw Error(localize.translate("email_already_in_use"));

    const hash = bcrypt.hashSync(password, 12);

    let addUser = new Appuser({ name: name, email: email, password: hash });

    const { accessToken, refreshToken } = createjwtToken(
      { uid: addUser._id, email },
      localize
    );

    addUser.auth = { accessToken: accessToken, refreshToken: refreshToken };

    await addUser.save();

    return res.status(200).json({
      status: localize.translate("success"),
      message: localize.translate("user_successfully_created"),
      data: {
        user: { name: addUser.name, email: addUser.email },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.signIn = catchAsync(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const localize = req.localize;

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ status: localize.translate("fail"), errors: errors.array() });

    let exitUser = await Appuser.findOne({ email, active: true });

    if (!exitUser) throw Error(localize.translate("account_not_found"));

    const cPassword = await bcrypt.compare(password, exitUser.password);

    if (!cPassword)
      throw Error(localize.translate("incorrect_email_or_password"));

    const { accessToken, refreshToken } = createjwtToken(
      { id: exitUser._id },
      localize
    );

    exitUser.auth = { accessToken: accessToken, refreshToken: refreshToken };

    await exitUser.save();

    return res.status(200).json({
      status: localize.translate("success"),
      message: localize.translate("user_successfully_login"),
      data: {
        user: { id: exitUser._id, email: exitUser.email, name: exitUser.name },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.userDelete = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    const localize = req.localize;

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ status: localize.translate("fail"), errors: errors.array() });
    const user = await Appuser.findById(id);

    if (!user) throw Error(localize.translate("account_not_found"));
    if (!user.active)
      throw Error(localize.translate("already_deleted_account"));

    user.active = false;

    await user.save();

    return res.status(200).json({
      status: localize.translate("success"),
      message: localize.translate("successfully_deleted_account"),
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

const createjwtToken = (data, localize) => {
  const accessToken = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRESIN,
  });
  const refreshToken = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: maxAge * 28,
  });

  if (!accessToken || !refreshToken)
    throw new Error(
      localize.translate("something_wrong_In_creating_tokens")
    );

  return { accessToken, refreshToken };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  try {
    const { email } = req.params;
    const localize = req.localize;

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ status: localize.translate("fail"), errors: errors.array() });

    const user = await Appuser.findOne({ email: email, active: true });

    if (!user) throw Error(localize.translate("account_not_found"));

    const token = randtoken(36);

    await user.updateOne({ resetToken: token });

    const mail = nodemailer.createTransport({
      service: "outlook",
      auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: process.env.SUBJECT,
      html: `<p>You requested for reset password, kindly use this<a href="${process.env.RESETPASSWORD_LINK}${token}">link</a>to reset your password</p>`,
    };

    await mail.sendMail(mailOptions);
    return res.status(200).json({
      status: localize.translate("success"),
      message: localize.translate("reset_password_email_sent"),
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.postResetPassword = catchAsync(async (req, res, next) => {
  try {
    const { password, confirmPassword, token } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: localize.translate("fail"),
        errors: errors.array(),
      });
    }

    if (password !== confirmPassword) throw Error(localize.translate("check_password"));

    const user = await Appuser.findOne({
      resetToken: token,
    });

    if (!user) throw Error(localize.translate("account_not_found"));

    const hashedPassword = bcrypt.hashSync(password, 12);

    await user.updateOne({
      password: hashedPassword,
      resetToken: "",
    });

    res.render("success");
    return res.status(200).json({
      status: localize.translate("success"),
      message: localize.translate("successfully_updated"),
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.getResetPassword = catchAsync(async (req, res) =>
  res.render(localize.translate("reset_password_email_button_reset_password"), {
    token: req.query.token,
  })
);

exports.changePassword = catchAsync(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { uid } = req.user;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: localize.translate("fail"),
        errors: errors.array(),
      });
    }

    const user = await Appuser.findOne({ _id: uid });

    if (!user) throw Error(localize.translate("account_not_found"));

    const hashCompare = await bcrypt.compare(oldPassword, user.password);

    if (!hashCompare) throw Error(localize.translate("check_old_password"));

    if (oldPassword === newPassword)
      throw Error(localize.translate("password_not_same_as_old_password"));

    const hash = bcrypt.hashSync(newPassword, 12);

    await user.updateOne({
      password: hash,
    });
    return res.status(200).json({
      status: localize.translate("success"),
      message: localize.translate("password_changed"),
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});
