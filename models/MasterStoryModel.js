const mongoose = require("mongoose");
const slugify = require("slugify");

const masterStorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    maxlength: [256, "Maximum story name length is 20 characters."],
    required: [true, "Story name is required."],
  },
  free: {
    type: Boolean,
    default: true,
  },
  image: {
    type: String,
    trim: true,
  },
  level: {
    type: String,
    default: "a1",
    enum: {
      values: ["a1", "a2", "b1", "b2", "c1", "c2"],
      message: "Invalid level value",
    },
    trim: true,
  },
});

masterStorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const MasterStory = mongoose.model("MasterStory", masterStorySchema);
module.exports = MasterStory;
