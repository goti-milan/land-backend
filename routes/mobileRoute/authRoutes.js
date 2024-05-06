const { Router } = require("express");
const authController = require("../../controllers/mobileController/authController");
const authorizeMobileUser = require("../../middlewares/authMobileUser");
const authValidation = require("../../validation/authValidation");

const router = Router();

router.post("/signup", authValidation.signUpValidation, authController.signUp);

router.post("/login", authValidation.signInValidation, authController.signIn);

router.patch(
  "/delete/:id",
  authValidation.deleteValidation,
  authController.userDelete
);

router.post(
  "/forgot-password/:email",
  authValidation.forgotPasswordValidation,
  authController.forgotPassword
);

router
  .route("/resetPassword")
  .get(authController.getResetPassword)
  .post(
    authValidation.resetPasswordValidation,
    authController.postResetPassword
  );

router.post(
  "/change-password",
  authorizeMobileUser,
  authValidation.changePasswordValidation,
  authController.changePassword
);

module.exports = router;
