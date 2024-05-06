const { Router } = require('express');
const LanguageController = require('../controllers/LanguageController');
const multer = require('multer');

const upload = multer();
const router = Router();

router.get('/', LanguageController.getLanguages);
router.post('/add', upload.none(), LanguageController.addLanguage);

module.exports = router;
