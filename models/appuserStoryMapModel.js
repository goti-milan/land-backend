const mongoose = require("mongoose");

const storyMap = new mongoose.Schema({
  userId: {
    type: String,
    trim: true,
  },
  storyId: {
    type: String,
    trin: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    trim: true,
    max: [5, "maxminum length is 5"],
    min: [1, "Minimum length is 1"],
  },
});

module.exports = mongoose.model("appuser-story-map", storyMap);
