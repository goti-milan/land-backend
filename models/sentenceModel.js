const mongoose = require("mongoose");

const sentenceSchema = new mongoose.Schema(
  {
    original: {
      type: String,
      trim: true,
    },
    translated: {
      type: String,
      trim: true,
    },
    storyId: {
      type: String,
      required: [true, "Please enter story this sentence belongs to!"],
    },
    image: {
      type: String,
      trim: true,
    },
    audio: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

const Sentence = mongoose.model("Sentence", sentenceSchema);
module.exports = Sentence;
