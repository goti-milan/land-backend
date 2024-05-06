const Item = require('../models/itemModel');
const catchAsync = require('../utils/catchAsync');

exports.getItems = () =>
  catchAsync(async (req, res, next) => {
    const items = await Item.find({ sentenceId: req.params.id });

    if (!items) {
      return next(new AppError('This sentence does not exist!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: items,
    });
  });
