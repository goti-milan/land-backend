const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const languageSchema = new mongoose.Schema({
  name: { 
    type: String,
    unique: true
  }
});

const Language = mongoose.model('Language', languageSchema);
module.exports = Language;
