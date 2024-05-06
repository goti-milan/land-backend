const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const Language = require("../models/LanguageModel");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id).select("+password");

    Object.entries(req.body).forEach(([key, value]) => (doc[key] = value));

    await doc.save();

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.updateAll = (Model) =>
  catchAsync(async (req, res, next) => {
    try {
      const data = req.body;
      const updatedRecord = data.map(async (item) => {
        const languageId = item?.languages.map(async (lang) => {
          const data = await Language.findById(lang);
          return data;
        });
        const allData = await (
          await Promise.all(languageId)
        ).map(async (value) => {
          await Model.updateOne(
            { _id: item?._id },
            { $set: { languages: [] } }
          );
          const record = await Model.updateOne(
            { _id: item?._id },
            { $push: { languages: value?._id } }
          );
          return record;
        });
      });
      res.status(201).json({
        status: "success",
      });
    } catch (error) {
      console.log("error===>", error);
    }
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id).populate("languages");
    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.findAll = (Model, where) =>
  catchAsync(async (req, res, next) => {
    const query = Model.find(where(req)).populate("languages");

    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }
    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });

exports.getAll = (Model, options) =>
  catchAsync(async (req, res, next) => {
    const query = Model.find({
      language: req.params.langId
    });

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: doc.length,
      data: doc,
    });
  });
