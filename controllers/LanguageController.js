const Language = require('../models/LanguageModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');

exports.addLanguage = catchAsync(async (req, res, next) => {
  const { name } = req.body;
    console.log('add with body name ' + name);
    if (name.length < 2) {
      return next(new AppError('Language name is too short', 400));
    }
    const language = await Language.create({
      name: name
    });
  
    res.status(200).json({
      status: 'success'
    });
  });

exports.getLanguages = catchAsync(async (req, res, next) => {
    const languages = await Language.find({});
    
    const data = { languages };

    res.status(200).json({
      status: 'success',
      data: languages
    });
  }); 
