const { body, param, query } = require("express-validator");

exports.markStoryValidation = [
  param("storyid", "Please select story!"),

  body("comment").isLength({
    max: 2000,
  }),
  body("rating", "Add rating between 1 to 5!").isLength({
    min: 1,
    max: 5,
  }),
];


exports.getStoryValidation = [
  query("language", "language field is required"),
  query("levels", "levels field is required"),
];
