const { Router } = require("express");
const multer = require("multer");
const upload = multer();
const authController = require("../controllers/authController");

const {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  findAll,
  updateAll,
} = require("../controllers/handlerFactory");

const User = require("../models/userModel");

const router = Router();

// Admin
router.post("/admin_login", upload.none(), authController.adminLogin);

// Writer
router.post("/login", upload.none(), authController.login);
router.get("/logout", authController.logout);
router.get("/protect", authController.protect);
router.get("/protectAdmin", authController.protectAdmin);

router.get("/", getAll(User));
router.get(
  "/writers",
  authController.authorizeAdmin,
  findAll(User, (req) => {
    return { role: "writer" };
  })
);
router.post("/writers/add", upload.none(), authController.addWriter);

router
  .route("/:id")
  .get(getOne(User))
  .patch(updateOne(User))
  .delete(deleteOne(User));

router.route("/language-bulk-update").put(updateAll(User));

module.exports = router;
