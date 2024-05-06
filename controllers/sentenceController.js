const Sentence = require('../models/sentenceModel');
const catchAsync = require('../utils/catchAsync');

exports.getSentences = () =>
  catchAsync(async (req, res, next) => {
    const sentences = await Sentence.find({ storyId: req.params.id });

    if (!sentences) {
      return next(new AppError('This story does not exist!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: sentences,
    });
  });
