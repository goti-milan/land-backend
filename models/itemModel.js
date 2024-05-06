const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  sentenceId: String,
  sentence: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sentence',
  },
  selectedWords: Array,
  items: {
    type: Array,
  },
  storyId: String,
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
