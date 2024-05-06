const { Router } = require("express");
const templateController = require("../controllers/templateController");
const multer = require("multer");
const upload = multer();

const router = Router();

router.post("/", upload.none(), templateController.addTemplate);
router.get("/:languageId", templateController.getTemplate);
router.patch("/:templateId", templateController.updateTemplateData);

module.exports = router;
