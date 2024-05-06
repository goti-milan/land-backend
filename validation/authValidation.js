const { body, param } = require("express-validator");

exports.signUpValidation = [
  body("email", "Check Email!").isEmail(),
  body("name", "please Enter name!").isString(),
  body("password", "please enter strong password with minimum 8 characters!")
    .isStrongPassword()
    .isLength({
      min: 8,
      max: 12,
    }),
];

exports.signInValidation = [
  body("email", "please enter email").isEmail(),
  body(
    "password",
    "please enter strong password with minimum 8 characters!"
  ).isLength({
    min: 8,
    max: 12,
  }),
];

exports.deleteValidation = [param("id", "select user to delete!").isString()];

exports.forgotPasswordValidation = [
  param("email", "please check your email!").isEmail(),
];

exports.resetPasswordValidation = [
  body(
    "password",
    "please enter strong password with minimum 8 characters!"
  ).isLength({
    min: 8,
    max: 12,
  }),
  body(
    "confirmPassword",
    "please enter strong confirmPassword with minimum 8 characters!"
  ).isLength({
    min: 8,
    max: 12,
  }),
  body("Token", "Invilid Token!"),
];

exports.changePasswordValidation = [
  body(
    "oldPassword",
    "please enter strong oldPassword with minimum 8 characters!"
  )
    .isStrongPassword()
    .isLength({
      min: 8,
      max: 12,
    }),
  body(
    "newPassword",
    "please enter strong newPassword with minimum 8 characters!"
  )
    .isStrongPassword()
    .isLength({
      min: 8,
      max: 12,
    }),
];
