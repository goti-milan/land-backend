const Item = require("../models/itemModel");
const Sentence = require("../models/sentenceModel");
const StoryTranslation = require("../models/StoryTranslationModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getStory = () =>
  catchAsync(async (req, res, next) => {
    const story = await StoryTranslation.findById(req.params.id).populate('masterStoryID').populate('language');
    const sentences = await Sentence.find({ storyId: req.params.id }).sort({
      createdAt: 1,
    });

    if (!story || !sentences)
      return next(new AppError("This story does not exist", 404));

    const data = { story, sentences };

    res.status(200).json({
      status: "success",
      data,
    });
  });

exports.getJSON = () =>
  catchAsync(async (req, res, next) => {
    const story = await StoryTranslation.findById(req.params.id).select("-__v");
    const doc = await Sentence.find({ storyId: req.params.id }).select("-__v");
    const sentences = [...doc];
    const items = await Item.find({ storyId: req.params.id }).select(
      "-storyId -__v"
    );

    items.forEach((item) => {
      const index = sentences.findIndex(
        (sentence) => sentence._id.toString() === item.sentenceId.toString()
      );
      if (index === -1) return;
      sentences[index].items.push(item);
    });

    if (!story || !sentences)
      return next(new AppError("This story does not exist", 404));

    res.status(200).json({
      status: "success",
      data: { story, sentences },
    });
  });
