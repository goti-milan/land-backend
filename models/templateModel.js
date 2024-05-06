const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Template name is require"],
  },
  language: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: "Language",
  },
  data: {
    type: Object,
    default: [],
  },
});

const Template = mongoose.model("template", templateSchema);
module.exports = Template;
