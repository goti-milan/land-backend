const { Router } = require('express');

const { createOne, updateOne } = require('../controllers/handlerFactory');
const { getItems } = require('../controllers/itemController');
const Item = require('../models/itemModel');

const router = Router();
router.post('/', createOne(Item));
router.route('/:id').get(getItems()).patch(updateOne(Item));

module.exports = router;
