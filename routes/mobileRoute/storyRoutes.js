const { Router } = require("express");
const router = Router();
const storyController = require("../../controllers/mobileController/storyController");
const authorizeMobileUser = require("../../middlewares/authMobileUser");
const storyValidation = require("../../validation/storyValidation");

router.get(
  "/",
  authorizeMobileUser,
  storyValidation.getStoryValidation,
  storyController.getStories
);

router.post(
  "/mark-as-seen/:storyId",
  authorizeMobileUser,
  storyValidation.markStoryValidation,
  storyController.userMarkStoryAsCompleted
);

module.exports = router;