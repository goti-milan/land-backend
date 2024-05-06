const AppError = require("../utils/appError");
const Template = require("../models/templateModel");
const catchAsync = require("../utils/catchAsync");
const Language = require("../models/LanguageModel");

exports.addTemplate = catchAsync(async (req, res, next) => {
  try {
    const { name, data, language } = req.body;

    if (!name || !language || !data)
      throw Error("Please Provide Name or Language!");

    const addTemplate = await Template.create({
      name: name,
      data: data,
      language: language,
    });

    if (!addTemplate) throw new Error("Please check your data!");

    return res.status(200).json({
      status: "Success",
      message: "Template Created Successfully!",
      data: {
        name: name,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.getTemplate = catchAsync(async (req, res, next) => {
  try {
    const getAllTemplate = await Template.find({
      language: req.params.languageId,
    });

    if (!getAllTemplate) throw Error("Data not Available!");

    return res.status(200).json({
      status: "Success",
      message: "Successfully Fetch Data!",
      data: {
        template: getAllTemplate,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});

exports.updateTemplateData = catchAsync(async (req, res, next) => {
  try {
    const { templateId } = req.params;
    const { data } = req.body;

    if (!data) throw Error("please Enter Data!");

    const exitTemplate = await Template.findOne({ _id: templateId });

    if (!exitTemplate) throw new Error("Please check your data");

    const updateTemplate = await exitTemplate.updateOne({
      data: data,
    });

    if (!updateTemplate) throw Error("Anything problem to update Data");

    return res.status(200).json({
      status: "success",
      message: "update Successfully",
      data: {
        template: updateTemplate,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 400));
  }
});
