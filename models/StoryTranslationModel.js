const mongoose = require("mongoose");
const slugify = require("slugify");

const storyTranslationSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    maxlength: [256, "Maximum story title length is 256 characters."],
    required: [true, "Story title is required"],
  },
  language: {
    type: mongoose.Types.ObjectId,
    ref: "Language"
  },
  active: {
    type: Boolean,
    default: false
  },
  masterStoryID: {
    type: mongoose.Types.ObjectId,
    required: [true, "Please link the translation to the story."],
    ref: "MasterStory"
  },
  levelOverride: {
    type: String,
    default: "a1",
    enum: {
      values: ["a1", "a2", "b1", "b2", "c1", "c2"],
      message: "Invalid level value",
    },
    trim: true,
  }
});

storyTranslationSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const StoryTranslation = mongoose.model("StoryTranslation", storyTranslationSchema);
module.exports = StoryTranslation;