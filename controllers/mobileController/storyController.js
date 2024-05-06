const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const storyMap = require("../../models/appuserStoryMapModel");
const { validationResult } = require("express-validator");
const Appuser = require("../../models/appuserModel");
const Story = require("../../models/StoryTranslationModel");

exports.userMarkStoryAsCompleted = catchAsync(async (req, res, next) => {
  try {
    const { comment, rating } = req.body;
    const { storyId } = req.params;
    const { uid } = req.user;

    const localize = req.localize;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: localize.translate("fail"),
        errors: errors.array(),
      });
    }

    const findUser = await storyMap.findOne({
      storyId: storyId,
      userIdL: uid,
    });

    if (findUser) {
      throw Error(localize.translate("already_seen_story"));
    }

    const user = await Appuser.findOne({ _id: uid, active: true });

    if (!user) throw Error(localize.translate("account_not_found"));

    const userStory = await Story.findOne({ _id: storyId });

    if (!userStory) throw Error(localize.translate("not_available_story"));

    const addStory = await storyMap.create({
      userId: uid,
      storyId: storyId,
      comment: comment,
      rating: rating,
    });

    if (!addStory) throw Error(localize.translate("check_data"));

    return res.status(200).json({
      status: localize.translate("success"),
      message: localize.translate("successfully_seen_story"),
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.getStories = catchAsync(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const localize = req.localize

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: localize.translate("fail"),
        errors: errors.array(),
      });
    }
    const { language, levels } = req.query;
    const filter = {
      ...(levels ? { level: levels.split(",") } : {}),
      ...(language ? { language: language } : {}),
    };
    const stories = await Story.find(filter);

    return res.status(200).json({
      status: localize.translate("success"),
      message: localize.translate("stories_fetched"),
      data: stories,
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});
