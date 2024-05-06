const { Router } = require("express");
const authController = require("../controllers/authController");
const multer = require("multer");
const upload = multer();

const { createOne, getAll, updateOne, getMasterData } = require("../controllers/handlerFactory");
const { getStory, getJSON } = require("../controllers/StoryTranslationController");
const StoryTranslation = require("../models/StoryTranslationModel");

const router = Router();

router.post(
  "/",
  upload.none(),
  authController.authorizeWriter,
  createOne(StoryTranslation)
);
router.get("/:id", authController.authorizeWriter, getStory());
router.get("/sentence/:langId", authController.authorizeWriter, getAll(StoryTranslation));
router.get("/json/:id", authController.authorizeWriter, getJSON());
router.patch("/:id", authController.authorizeWriter, updateOne(StoryTranslation));

module.exports = router;
